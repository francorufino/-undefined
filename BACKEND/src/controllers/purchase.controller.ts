import { Request, Response } from "express";
import * as purchaseService from "../services/purchase.service.js";

export async function getPurchase(req: Request, res: Response) {
  try {
    const user = req.user;

    if(!user){
      return res.status(401).json({ message: "Unauthorized" });
    }

    if(user.role !== "admin"){
     const purchase = await purchaseService.getPurchaseByUserId(user.id);
     return res.status(200).json(purchase);
    }

    const purchases = await purchaseService.getAllPurchases();
    return res.status(200).json(purchases);
    
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}