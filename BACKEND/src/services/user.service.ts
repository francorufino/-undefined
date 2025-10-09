import {User} from "../models/user.model.js";
import {IUser, IUserSemAge} from "../interfaces/IUser.js";

export async function getUsers(): Promise<IUser[] | null>{
  try{
    const users= await User.find();
    return users;
  } catch (error){
    console.log(error);
    return null;
  }
}

export async function getUsersSemAge(): Promise<IUserSemAge[] | null>{
  try{
    const users = await User.find().select("-age");
    return users as IUserSemAge[];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function createUser(user: IUser): Promise<IUser | null>{
  try{
    const existingUser = await User.findOne({email:user.email});
    if(existingUser) return null;
    const createdUser = await User.create(user);
    return createdUser;
  } catch(error){
    console.log(error);
    return null;
  }
}

export async function getUserById(id:string): Promise<IUser | null>{
try {
  const foundUser = await User.findById(id);
  if(!foundUser) return null;
  return foundUser
  } catch(error) {
    console.log(error);
    return null;
  }
}
