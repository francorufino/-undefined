import moongose from "mongoose";

export interface IPurchase {
  userId: moongose.Types.ObjectId;
  productId: moongose.Types.ObjectId;
  quantity: number;
  totalPrice: number;
  status: ["pending", "completed", "canceled"];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPurchaseCreated {
  userId: string;
  productId: string;
  quantity: number;
}