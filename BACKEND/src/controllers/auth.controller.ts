import { Request, Response } from "express";
import * as authService from "../services/auth.service.js";

export async function createUser(req: Request, res: Response) {
  try {
    const {name, email, password, age, role} = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const user = await authService.createUser({name, email, password, age, role});
    if (!user) {
      return res.status(400).json({ message: "User already exists" });
    }
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" }); 
  }
}

export async function login(req: Request, res: Response){
  try{
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(400).json({message: "Missing required fields"});
    }

    const user = await authService.login({email, password});
    
    if(!user){
      return res.status(401).json({message: "Invalid credentials"});
    }

    return res.status(200).json({token: user.token});

  } catch(error){
    return res.status(500).json({message: "Internal Server Error"});
  }
}