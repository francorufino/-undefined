import mongoose from "mongoose";
import { IPurchase, IPurchaseCreated } from "../interfaces/IPurchase";
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

export async function getPurchaseById(purchaseID: string, userId: string, isAdmin: boolean){
  try{
    const getPurchaseById = await Purchase.findById(purchaseID).populate("userId").populate("productID");
    if(!getPurchaseById){
      return null;
    }
    if(!isAdmin && getPurchaseById.userId.toString() !== userId){
      return {"error": "Unauthorized" };
    }
    return getPurchaseById;
  } catch (error) { 
    return null;
  }
}

export async function createPurchase(purchaseData:  IPurchaseCreated){
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log("purchaseData", purchaseData);
    const product = await Product.findOneAndUpdate({
      _id: purchaseData.productId,
      stock: { $gte: purchaseData.quantity }
    }, {
      $inc: {
        stock: -purchaseData.quantity!
      }
    }, {new: true, session});
    console.log("product", product);
    if(!product){
      const existingProduct = await Product.findById(purchaseData.productId).session(session);
      if(!existingProduct){
        throw new Error("Product not found");
      } 
      console.log("aqui") 
      throw new Error("Insufficient stock");
    }
    const totalPrice = product.price * (purchaseData.quantity!);
    console.log("aqui deu ruim", purchaseData);
    const newPurchase = await Purchase.create([{
      userId: purchaseData.userId,
      productId: purchaseData.productId,
      quantity: purchaseData.quantity,
      totalPrice: totalPrice,
      status: "completed"
    }], {session});
    await session.commitTransaction();
    session.endSession();
    
    return newPurchase[0];
  } 
  catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

export async function deletePurchase (purchaseId: string, userId: string, userRole: string){
 
 const session = await mongoose.startSession();
 session.startTransaction();
 
 try{
  const purchase = await Purchase.findById(purchaseId).session(session);
  if(!purchase){
    await session.abortTransaction();
    session.endSession();
    throw new Error("Purchase not found");
  }

  if(userRole !== "admin" || purchase.userId.toString() !== userId){
    session.abortTransaction();
    session.endSession();
    throw new Error("Unauthorized - you dont have permission to delete this purchase");
}
   await Product.findOneAndUpdate({
      _id: purchase.productId,
     
    }, {
      $inc: {
        stock: +purchase.quantity!
      }
    }, {new: true, session});

    purchase.status = "canceled";
    await purchase.save({session});
    await session.commitTransaction();
    session.endSession();
    return {message: "Purchase deleted successfully"};

} catch (error){
  await session.abortTransaction();
  session.endSession();
  throw error;
}



}