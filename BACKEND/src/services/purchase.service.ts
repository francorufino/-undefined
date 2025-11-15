import mongoose from "mongoose";
import { IProduct } from "../interfaces/IProduct";
import { Product } from "../models/product.model";
import { Purchase } from "../models/purchase.model";

export async function getAllPurchases(){
  try {
    const getPurchases = await Purchase.find().populate("userId").populate("productId");
    return getPurchases;
  } catch (error) {
    return null;
  }
}

export async function getPurchaseByUserId(userId: string){
  try {
    const getPurchases = await Purchase.find({userId}).populate("userId").populate("productId");
    return getPurchases;
  } catch (error) {
    return null;
  }
}
