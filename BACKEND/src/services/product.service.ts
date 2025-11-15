import mongoose from "mongoose";
import { IProduct } from "../interfaces/IProduct";
import { Product } from "../models/product.model";

export async function getProducts(){
  try {
    const products = await Product.find();
    return products;
  } catch (error) {
    return null;
  }
}

export async function createProduct(productData: IProduct): Promise<IProduct | null> {
  try {
    
    const savedProduct = await Product.create(productData);
    return savedProduct;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Error creating product");
  }
}


export async function getProductsById(id:string): Promise<IProduct | null> {
  try {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new Error("Invalid ID format from MongoDB");
    }
    const product = await Product.findById(id);
    return product;
  } catch (error) {
    return null;
  }
}

export async function deleteProduct(id:string): Promise<IProduct | null> {
  // try {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new Error("Invalid ID format from MongoDB");
    }
    const productById = await Product.findById(id);
    if(!productById){
      return null;
    }
    productById.isActive = false;
    await productById.save();
    return productById;
  // } catch (error) {
  //   return null;
  // }
}