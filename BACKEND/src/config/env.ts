import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 3001,
  MONGO_URL: process.env.MONGO_URL || "",
}