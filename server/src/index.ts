import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Базовый тестовый маршрут
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Server is running smoothly" });
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
// Костыль для удержания Event Loop, если лоадер завершает процесс
setInterval(() => {}, 1 << 30);
