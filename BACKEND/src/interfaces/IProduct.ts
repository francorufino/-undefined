export interface IProduct{
  name: string;
  description: string;
  price: number;
  modelRobot: ModelRobot[];
  stock: number;
  imagemUrl?: string[];
  videoUrl?: string[];
  onSale?: boolean;
  isActive?: boolean;
}

export enum ModelRobot {HUMANOID="HUMANOID",  PET="PET",  VACUUM="VACUUM"} 
