import { Product } from "../models/product.model";

export async function getProducts(){
  try {
    const products = await Product.find();
    return products;
  } catch (error) {
    return null;
  }
}