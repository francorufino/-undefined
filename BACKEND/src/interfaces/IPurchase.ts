import moongose from "mongoose";

export interface IPurchase {
  userId: moongose.Types.ObjectId;
  productId: moongose.Types.ObjectId;
  quantity: number;
  totalPrice: number;
  status: ["pending", "completed", "canceled"];
}