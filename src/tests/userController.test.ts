import request from 'supertest';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import app from '../../index';
import * as userRepository from '../../repositories/userRepository';
import { UserType } from '../../models/User';

// Mock the userRepository
jest.mock('../../repositories/userRepository');

describe('User Controller', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users/:id', () => {
    it('should return 404 if a user is not found', async ():Promise<void> => {
    });
  });
});
