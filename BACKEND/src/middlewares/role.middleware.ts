import {Request, Response, NextFunction} from 'express';
import { UserRole } from '../interfaces/UserRole';

export const authorizedRole = (role: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    const typedRole = userRole as UserRole;

    if(!role.includes(typedRole)){
      return res.status(403).json({message: "Forbidden: You don't have enough permissions"});
    }
    next();
  }
} 