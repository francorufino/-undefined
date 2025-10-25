import mongoose from "mongoose";
import { IProduct } from "../interfaces/IProduct.js";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true,
    min: 10,
  },
  modelRobot: {
    type: String,
    enum: ["Humanoid", "Pet", "Vacuum"],
    required: true,
  },
    imagemUrl: {
    type: String,
    required: false,
  },
   videoUrl: {
    type: String,
    required: false,
  },
  onSale: {
    type: Boolean,
    default: false
  }
});

export const Product = mongoose.model<IProduct>("Product", productSchema);

// BANCO DE DADOS
