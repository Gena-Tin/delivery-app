import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { query } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
// Костыль для удержания Event Loop, если лоадер завершает процесс
setInterval(() => {}, 1 << 30);
