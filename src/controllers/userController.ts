import { Result, ValidationError, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { User } from '../models/User';
import { createUser, findUserByEmail, findUserById } from '../repositories/userRepository';
import { removePassword } from '../utils/utils';

/**
 * Creates a new user in the system
 *
 * Validates the request body, checks if the user already exists,
 * hashes the password for security, and creates a new user record.
 *
 * @param req - Express request object containing user details in the body
 * @param res - Express response object
 * @returns JSON response with created user data (excluding password) or error message
 */
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
      return res.status(500).json({ error: 'Internal server error' });
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

    return res.status(201).json(removePassword(newUser));
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Retrieves a user by their ID
 *
 * Fetches user details from the data store based on the provided ID parameter
 * and returns the user information with the password removed for security.
 *
 * @param req - Express request object containing user ID in the params
 * @param res - Express response object
 * @returns JSON response with user data (excluding password) or error message
 */
export const getUserById = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const user:User | undefined = findUserById(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(removePassword(user));
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
