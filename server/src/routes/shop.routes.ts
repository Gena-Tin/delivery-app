import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwtLib from "jsonwebtoken";
import { query } from "../config/db.js";

export const shopRoutes = Router();

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_admin_key";

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

// Middleware для проверки JWT в защищенных запросах
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwtLib.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

// ==========================================
// AUTH ROUTE
// ==========================================
shopRoutes.post(
  "/login",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return;
      }

      const result = await query(
        "SELECT * FROM shop.users WHERE username = $1",
        [username],
      );
      if (result.rows.length === 0) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const user = result.rows[0];
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash,
      );

      if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      // Генерируем JWT на 8 часов
      const token = jwtLib.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        {
          expiresIn: "8h",
        },
      );

      res.json({ message: "Login successful", token });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
);

// ==========================================
// SHOP & GOODS ROUTES
// ==========================================

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

// ==========================================
// ORDERS ROUTES
// ==========================================

// 3. Создать новый заказ (с geo-координатами)
shopRoutes.post(
  "/orders",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, phone, email, address, goods, totalPrice, coordinates } =
        req.body;

      if (!name || !phone || !goods || !totalPrice) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const orderCode = generateOrderCode();

      const orderData = {
        customer: {
          name: name,
          phone: phone,
          email: email || null,
          address: address || "Delivery to coordinates",
        },
        goods: goods,
        totalPrice: totalPrice,
        delivery_location: coordinates
          ? {
              type: "Point",
              coordinates: coordinates,
            }
          : null,
      };

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

// 5. Обновление статуса заказа (ЗАЩИЩЕНО verifyToken)
shopRoutes.patch(
  "/orders/:id/status",
  verifyToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        res.status(400).json({ error: "Status is required" });
        return;
      }

      const result = await query(
        `UPDATE shop.orders 
         SET status = $1 
         WHERE id = $2 
         RETURNING id, order_code, status`,
        [status, id],
      );

      if (result.rowCount === 0) {
        res.status(404).json({ error: "Order not found" });
        return;
      }

      res.json({
        message: "Status updated successfully",
        order: result.rows[0],
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
);
