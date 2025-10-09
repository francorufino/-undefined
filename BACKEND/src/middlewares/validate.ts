import {Request, Response, NextFunction} from 'express';
import {ZodSchema, z} from 'zod';

export const validate = 
  (schema: ZodSchema) => 
  (req: Request, res: Response, next: NextFunction): 
  NextFunction | void | Response => {
    const result = schema.safeParse(req.body);

    if(!result.success){
      const errors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (!errors[key]) errors[key] = [];
        errors[key].push(issue.message);
        console.log(issue);
    });
    return res.status(400).json({errors});
  }
  req.body = result.data;
  next();
};

