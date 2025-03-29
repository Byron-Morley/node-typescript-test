import { Result, ValidationError, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { User } from '../models/User';
import { createUser, findUserByEmail } from '../repositories/userRepository';


export const createNewUser = async (req: Request, res: Response) => {
  const errors:Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      fullName, email, password, userType,
    } = req.body;

    // does the user already exist
    const existingUser :User | undefined = findUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: 'User already exists' });
    }

    // hash the password
    const saltRounds = 10;
    const hashedPassword:string = await bcrypt.hash(password, saltRounds);

    const newUser: User = createUser({
      fullName,
      email,
      userType,
      password: hashedPassword,
    });

    // remove the password from the return object
    const { password: _, ...userWithoutPasword } = newUser;
    return res.status(201).json(userWithoutPasword);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserById = (req: Request, res: Response): void => {
  // TODO implement later
};
