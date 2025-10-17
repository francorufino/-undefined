export interface IUser{
  name: string;
  email: string;
  age: number;
  password: string;
  role?: "user" | "admin";
}
export interface IUserSemAge{
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}