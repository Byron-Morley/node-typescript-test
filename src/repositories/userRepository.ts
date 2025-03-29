import { v4 as uuidv4 } from 'uuid';
import db from '../db/database';
import { User } from '../models/User';

export const findUserByEmail = (email:string): User | undefined => {
  try {
    const query = db.prepare('SELECT * FROM users WHERE email = ?');
    return query.get(email) as User | undefined;
  } catch (error) {
    console.error('Error finding user by email', error);
    throw error;
  }
};

export const findUserById = (id:string):User | undefined => {
  try {
    const query = db.prepare('SELECT * FROM users WHERE id = ?');
    return query.get(id) as User | undefined;
  } catch (error) {
    console.error('Error finding user by id', error);
    throw error;
  }
};

export const createUser = (userData:Omit<User, 'id' | 'createdDate'>): User => {
  try {
    const id:string = uuidv4();
    const createdDate:string = new Date().toISOString();

    const query = db.prepare('INSERT INTO users (id, fullName, email, password, userType, createdDate) VALUES (?,?,?,?,?,?)');

    const {
      fullName, email, password, userType,
    } = userData;

    query.run(
      id,
      fullName,
      email,
      password,
      userType,
      createdDate,
    );

    return {
      id,
      fullName,
      email,
      password,
      userType,
      createdDate,
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
