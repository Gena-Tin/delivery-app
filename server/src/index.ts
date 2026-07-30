import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { query } from "./config/db.js";
import { shopRoutes } from "./routes/shop.routes.js"; // <- Импортируем роуты

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(
  cors({
    origin: ["https://delivery-app-gt.netlify.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.use("/api", shopRoutes); // Теперь все роуты доступны по путям /api/goods, /api/orders и т.д.

// Базовый маршрут
app.get("/api/health", async (req: Request, res: Response) => {
  try {
    // Делаем простейший запрос к базе
    const dbResult = await query("SELECT NOW()");
    res.json({
      status: "ok",
      message: "Server is running smoothly",
      database: "connected",
      dbTime: dbResult.rows[0].now,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// чтобы на Vercel не плодились лишние логи слушателя портов оборачиваем в IF
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
}

// Костыль для удержания Event Loop, если лоадер завершает процесс
setInterval(() => {}, 1 << 30);

export default app;
