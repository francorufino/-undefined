import { Request, Response } from "express";
import * as purchaseService from "../services/purchase.service.js";
import { IPurchaseCreated } from "../interfaces/IPurchase.js";


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

export async function getPurchaseById(req: Request, res: Response) {
  try {
    const {id} = req.params;
    const user = req.user;
     if(!user){
      return res.status(401).json({ message: "Unauthorized" });
    }
    const purchase = await purchaseService.getPurchaseById(id, user.id, user.role === "admin");
    if(!purchase){
      return res.status(404).json({ message: "Purchase not found" });
    } else if("error" in purchase){
      return res.status(403).json({ message: "Forbidden" });
    }
    return res.status(200).json(purchase);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export async function createPurchase(req: Request, res: Response) {
  try {
    const user = req.user;

    if(!user){
      return res.status(401).json({ message: "Unauthorized" });
    }
    const {productId, quantity} = req.body;
    if(!productId || !quantity){
      return res.status(400).json({ message: "productID and quantity are required" });
    }
    const purchaseData = {
      userId: user.id,
      productId: productId,
      quantity: quantity,
    } as IPurchaseCreated;
    const newPurchase = await purchaseService.createPurchase(purchaseData);
    console.log(newPurchase);
   
   

    return res.status(201).json(newPurchase);
    
  } 
  catch (error: any) {
    console.error(error);
    if(error.message === "Insufficient stock"){
      return res.status(400).json({ message: "Insufficient stock" });
    }
    if(error.message === "Product not found"){
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

