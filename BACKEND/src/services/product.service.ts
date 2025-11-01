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