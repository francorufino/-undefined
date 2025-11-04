export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inStock: boolean;
  category: string;
  imageUrl: string;
  videoUrl?: string;

  // novos campos importantes:
  fileUrl?: string;             // link do "upgrade" (download do módulo)
  fileSizeMB?: number;          // tamanho do upgrade
  compatibleModels: string[];   // robôs compatíveis com o upgrade
  version: string;              // versão do upgrade (ex: v1.3.2)
  releaseDate: string;          // data de lançamento
  updatedAt?: string;           // controle de atualização
  createdByAdminId?: string;    // ID do admin que cadastrou
  tags?: string[];              // metadados (ex: “AI”, “Motion”, “Karate”)
  isDigital: boolean;           // true, porque é um produto para download
}
