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
export async function createProduct(req: Request, res: Response) {
  try {
    const files = req.files as {[fieldName: string]: Express.Multer.File[]};
    const imagesURL = files["images"] ?.map((file) => `/uploads/${file.filename}`) || [];
    const videosURL = files ["videos"] ?.map((file) => `/uploads/${file.filename}`) || [];
    const productData = {
      name: req.body.name,
      description: req.body.description,
      modelRobot: req.body.modelRobot,
      stock: parseInt(req.body.stock),
      onSale: req.body.onSale === "true" ? true : false,
      price: parseFloat(req.body.price),
      imagemUrl: imagesURL,
      videoUrl: videosURL,
    };
    const createdProduct = await productService.createProduct(productData);
    return res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Internal Server Error" });
}
}

export async function getProductsById(req: Request, res: Response) {
  console.log(req);
  try {
   const product = await productService.getProductsById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error: any) {
    if(error.message === "Invalid ID format from MongoDB"){
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteProduct(req: Request, res: Response){
  // try {
    const id = req.params.id;
    const product = await productService.deleteProduct(id);
    console.log(product)
    if(!product){
      return res.status(404).json({message: "Product not found"});
    }
    return res.status(200).json({message: "Product deleted successfully"});
  // } catch (error: any) {
  //   if(error.message === "Invalid ID format from MongoDB"){
  //     return res.status(400).json({ message: error.message });
  //   }
  //   return res.status(500).json({ message: "Internal Server Error" });
  // }  
}