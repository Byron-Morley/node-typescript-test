import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import {createNewUser, getUserById} from '../controllers/userController';
import { findUserByEmail, createUser, findUserById } from '../repositories/userRepository';
import { removePassword } from '../utils/utils';
import { createMockUser } from '../fixtures/userFixtures';
import { User } from '../models/User';

const { validationResult } = require('express-validator');

// Mock dependencies
jest.mock('express-validator', () => ({
  validationResult: jest.fn().mockImplementation(() => ({
    isEmpty: () => true,
    array: () => [],
  })),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword123'),
}));

jest.mock('../repositories/userRepository', () => ({
  findUserByEmail: jest.fn(),
  findUserById: jest.fn(),
  createUser: jest.fn(),
}));

jest.mock('../utils/utils', () => ({
  removePassword: jest.fn((user) => ({ ...user, password: undefined })),
}));

describe('User Controller', (): void => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let responseObject: any = {};

  beforeEach(() => {
    jest.clearAllMocks();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result: any) => {
        responseObject = result;
        return mockResponse;
      }),
    };
  });

  describe('createNewUser', () => {
    beforeEach(() => {
      mockRequest = {
        body: {
          fullName: 'Test User',
          email: 'test@example.com',
          password: 'Password123',
          userType: 'student',
        },
      };
    });

    it('should create a new user successfully', async () => {
      // Mock user doesn't exist
      (findUserByEmail as jest.Mock).mockReturnValue(undefined);

      const mockUser: User = createMockUser();
      (createUser as jest.Mock).mockReturnValue(mockUser);

      await createNewUser(mockRequest as Request, mockResponse as Response);

      expect(findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('Password123', 10);

      expect(createUser).toHaveBeenCalledWith({
        fullName: 'Test User',
        email: 'test@example.com',
        userType: 'student',
        password: 'hashedPassword123',
      });

      expect(removePassword).toHaveBeenCalledWith(mockUser);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });
    it('should return a 500 if the user already exists', async () => {
      // Create a mock existing user with the same email as in the request
      const existingUser = createMockUser({
        email: 'test@example.com',
      });

      // Mock findUserByEmail to return the existing user
      (findUserByEmail as jest.Mock).mockReturnValue(existingUser);

      await createNewUser(mockRequest as Request, mockResponse as Response);

      expect(findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });

      expect(createUser).not.toHaveBeenCalled();
    });
    it('should return a 400 when validation fails', async () => {
      validationResult.mockImplementationOnce(() => ({
        isEmpty: () => false,
        array: () => [{ msg: 'Invalid email format', param: 'email' }],
      }));

      const invalidUser = createMockUser({
        email: 'testexample.com',
      });

      mockRequest = {
        body: {
          fullName: invalidUser.fullName,
          email: invalidUser.email,
          password: 'Password123',
          userType: invalidUser.userType,
        },
      };

      await createNewUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errors: [{ msg: 'Invalid email format', param: 'email' }],
      });

      expect(findUserByEmail).not.toHaveBeenCalled();
      expect(createUser).not.toHaveBeenCalled();
    });
    it('should return a 500 status when an unexpected error occurs', async () => {
      // Mock user doesn't exist
      (findUserByEmail as jest.Mock).mockReturnValue(undefined);

      // Make bcrypt.hash throw an error to trigger the catch block
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Bcrypt error'));

      await createNewUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
      expect(createUser).not.toHaveBeenCalled();
    });
  });
  describe('getUserById', () => {
    beforeEach(() => {
      jest.clearAllMocks();

      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockImplementation((result: any) => {
          responseObject = result;
          return mockResponse;
        }),
      };
    });

    it('should return user details when valid ID is provided', () => {
      // Arrange
      const mockUser = createMockUser();
      (findUserById as jest.Mock).mockReturnValue(mockUser);

      mockRequest = {
        params: { id: 'valid-user-id' },
      };

      getUserById(mockRequest as Request, mockResponse as Response);

      expect(findUserById).toHaveBeenCalledWith('valid-user-id');
      expect(removePassword).toHaveBeenCalledWith(mockUser);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should return 400 when ID is not provided', () => {
      mockRequest = {
        params: {},
      };

      getUserById(mockRequest as Request, mockResponse as Response);

      expect(findUserById).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User ID is required' });
    });

    it('should return 404 when user is not found', () => {
      (findUserById as jest.Mock).mockReturnValue(undefined);

      mockRequest = {
        params: { id: 'non-existent-id' },
      };

      getUserById(mockRequest as Request, mockResponse as Response);

      expect(findUserById).toHaveBeenCalledWith('non-existent-id');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 500 when an unexpected error occurs', () => {
      (findUserById as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      mockRequest = {
        params: { id: 'valid-user-id' },
      };

      getUserById(mockRequest as Request, mockResponse as Response);

      expect(findUserById).toHaveBeenCalledWith('valid-user-id');
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});
