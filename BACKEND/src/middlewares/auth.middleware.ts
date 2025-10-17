import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { IPayload } from "../interfaces/IPayload.js";

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