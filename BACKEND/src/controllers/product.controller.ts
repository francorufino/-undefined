import { Request, Response } from "express";
import * as productService from "../services/product.service.js";

export async function getProducts(req: Request, res: Response) {
  try {
    const products = await productService.getProducts();
    console.log("retorno da chamada de products:", products);
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}