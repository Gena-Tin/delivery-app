import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Создаем пул соединений с базой данных
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Обязательно для Neon
  },
  max: 10, // Ограничиваем пул для бесконфликтной работы в serverless
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};
