import { UserRole} from "../interfaces/UserRole.js";

export interface IUserResponse {
  name: string;
  email: string;
  age: number;
  role: UserRole;
}

export interface IUserResponsePassword {
  name: string;
  email: string;
  age: number;
  role: UserRole;
  password: string;
}