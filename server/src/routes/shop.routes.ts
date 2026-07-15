import { Router, Request, Response } from "express";
import { query } from "../config/db.js";

export const shopRoutes = Router();

// Вспомогательная функция для генерации случайного кода заказа
const generateOrderCode = (length = 4): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 1. Получить все магазины
shopRoutes.get("/shops", async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await query("SELECT * FROM shop.shops ORDER BY id ASC");
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Получаем все товары (с информацией о магазине)
shopRoutes.get("/goods", async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await query(`
      SELECT g.id, g.title, g.image, g.cost, s.name as shop_name 
      FROM shop.goods g
      JOIN shop.shops s ON g.shop_id = s.id
      ORDER BY g.id ASC
    `);
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Создать новый заказ (с geo-координатами)
shopRoutes.post(
  "/orders",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, phone, email, address, goods, totalPrice, coordinates } =
        req.body;

      // Простая валидация входных данных
      if (!name || !phone || !goods || !totalPrice) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const orderCode = generateOrderCode();

      // Формируем NoSQL-структуру для хранения в JSONB
      const orderData = {
        customer: {
          name: name,
          phone: phone,
          email: email || null,
          address: address || "Delivery to coordinates",
        },
        goods: goods, // Массив купленных товаров с ценами на момент покупки
        totalPrice: totalPrice,
        // Сохраняем геометку в стандартном формате GeoJSON
        delivery_location: coordinates
          ? {
              type: "Point",
              coordinates: coordinates, // Ожидаем массив [lng, lat] с фронтенда
            }
          : null,
      };

      // Записываем в базу данных
      const result = await query(
        `INSERT INTO shop.orders (order_code, order_data) 
       VALUES ($1, $2) 
       RETURNING id, order_code, status, created_at`,
        [orderCode, JSON.stringify(orderData)],
      );

      res.status(201).json({
        message: "Order created successfully",
        order: result.rows[0],
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
);

// 4. Получить историю заказов
shopRoutes.get(
  "/orders",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await query(
        "SELECT * FROM shop.orders ORDER BY created_at DESC",
      );
      res.json(result.rows);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
);
