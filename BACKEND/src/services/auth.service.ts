import { IUserResponse } from "../interfaces/IUserResponse.js";
import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { UserRole } from "../interfaces/UserRole.js";
import {IUser} from "../interfaces/IUser.js";
import { log } from "console";
import { IUserLogin } from "../interfaces/IUserLogin.js";
import { IToken } from "../interfaces/IToken.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import {createToken} from "../middlewares/auth.middleware.js";

export async function createUser(user: IUser): Promise<IUserResponse | null>{
  try{
    const existingUser = await User.findOne({email:user.email});
    if(existingUser) return null;

    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    const createdUser = await User.create({
      ...user,
      password: hashedPassword,
      role: user.role || "user"
    });
    console.log(createdUser);

    return {
      name: createdUser.name,
      email: createdUser.email,
      age: createdUser.age,
      role: createdUser.role as UserRole,
    }
    // IF I WANTED TO RETURN THE USER WITH THE PASSWORD, I WOULD DO IT LIKE THIS: 
    // (UNSAFE - BUT FOR TESTING PURPOSES);
  //   export async function createUser(user: IUser): Promise<IUserPassword | null>{
  // try{
  //   const existingUser = await User.findOne({email:user.email});
  //   if(existingUser) return null;

  //   const hashedPassword = await bcrypt.hash(user.password, 10);
    
  //   const createdUser = await User.create({
  //     ...user,
  //     password: hashedPassword,
  //     role: user.role || "user"
  //   })
    //  return {
    //   name: createdUser.name,
    //   email: createdUser.email,
    //   age: createdUser.age,
    //   role: createdUser.role as UserRole,
    //   password: createdUser.password
    // }
  } catch(error){
    console.log(error);
    return null;
  }
}

export async function login(user: IUserLogin): Promise<IToken | null>{
  try {
    const existingUser = await User.findOne({email:user.email});
    if(!existingUser) return null;
    const isMatch = await bcrypt.compare(user.password, existingUser.password);
    if(!isMatch) return null;
    const token = createToken({id: existingUser._id as unknown as string, role: existingUser.role!}); 
    return {token};

  } catch(error) {
    console.log(error);
    return null;
  }
}
