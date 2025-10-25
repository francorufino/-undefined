import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { IPayload } from "../interfaces/IPayload.js";
import { Request, Response, NextFunction } from "express";
declare module 'express-serve-static-core' {
  interface Request {
    user?: IPayload;
  }
}
export function createToken(data: IPayload): string{
  return jwt.sign({id: data.id, role:data.role}, env.JWT_SECRET, {expiresIn:"1h"});
}

export async function verifyToken(token: string):Promise<IPayload | null>  {
  if(!token) return null;
  try{
    const decoded = await jwt.verify(token, env.JWT_SECRET) as IPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function authenticate (req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const payload = await verifyToken(token);

  if (!payload) {
    return res.status(401).json({ message: "Invalid token" });
  }

  req.user = payload; // Attach user info to request object
  next();
}