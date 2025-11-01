export interface IProduct{
  name: string;
  description: string;
  price: number;
  modelRobot: ModelRobot;
  stock: number;
  imagemUrl?: string[];
  videoUrl?: string[];
  onSale?: boolean;
}

export type ModelRobot = "Humanoid" | "Pet" | "Vacuum" 
