import express, {Request, Response} from 'express';
import helloRouter from "./routes/helloRouter.js";
import userRouter from "./routes/user.router.js";
import { connectDB } from './config/db.js';
import cors from 'cors';

const app = express();

connectDB();
app.use(cors());

app.use(express.json());

app.get("/", (_req: Request, res: Response) => res.json({message: "Hellow World!"}));
app.use ("/hello", helloRouter);
app.use ("/users", userRouter);

export default app;