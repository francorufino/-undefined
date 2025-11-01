import express, {Request, Response} from 'express';
import helloRouter from "./routes/helloRouter.js";
import userRouter from "./routes/user.router.js";
import authRouter from './routes/auth.router.js';
import { connectDB } from './config/db.js';
import cors from 'cors';
import productRouter from './routes/product.router.js';
import path from 'path';

const app = express();

connectDB();
app.use(cors());

app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.get("/", (_req: Request, res: Response) => res.json({message: "Hellow World!"}));
app.use ("/hello", helloRouter);
app.use("/auth", authRouter); 
app.use ("/users", userRouter);
app.use("/products", productRouter); 

export default app;