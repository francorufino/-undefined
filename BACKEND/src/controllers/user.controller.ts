import { Request, Response } from "express";
import * as userService from "../services/user.service.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

export async function getUsersSemAge(req: Request, res: Response) {
  try {
    const users = await userService.getUsersSemAge();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" }); 
  }
}

export async function getUsers(req: Request, res: Response) {
  
  try {
    const users = await userService.getUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" }); 
  }
}
  
export async function getUserById(req: Request, res: Response) {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" }); 
  }
}