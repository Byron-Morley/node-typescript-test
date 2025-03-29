import db from '../db/database';
import { User } from '../models/User';
import { createUser, findUserByEmail, findUserById } from '../repositories/userRepository';
import { createMockUser } from '../fixtures/userFixtures';

// Mock the database
jest.mock('../db/database', () => ({
  prepare: jest.fn(),
}));

describe('User Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserByEmail', () => {
    it('should return a user when found by email', () => {
      // Create mock user with the SAME email we'll search for
      const testEmail = 'test@example.com';
      const mockUser: User = createMockUser({ email: testEmail });

      // Mock the database query
      const getMock = jest.fn().mockReturnValue(mockUser);
      (db.prepare as jest.Mock).mockReturnValue({ get: getMock });

      // Call the function with the SAME email
      const result: User | undefined = findUserByEmail(testEmail);

      // Assertions
      expect(db.prepare).toHaveBeenCalledWith('SELECT * FROM users WHERE email = ?');
      expect(getMock).toHaveBeenCalledWith(testEmail);
      expect(result).toEqual(mockUser);
    });
    it('should return undefined when a user is not found by email', () => {
      // The email we'll search for
      const testEmail = 'test@example.com';

      // Mock the database query to return undefined (user not found)
      const getMock = jest.fn().mockReturnValue(undefined);
      (db.prepare as jest.Mock).mockReturnValue({ get: getMock });

      // Call the function with the test email
      const result: User | undefined = findUserByEmail(testEmail);

      // Assertions
      expect(db.prepare).toHaveBeenCalledWith('SELECT * FROM users WHERE email = ?');
      expect(getMock).toHaveBeenCalledWith(testEmail);
      expect(result).toBeUndefined();
    });
  });
  describe('findUserById', () => {
    it('should return a user when found by id', () => {
      // Create mock user with the SAME email we'll search for
      const testId = 'uklghK3478t234vb234RR';
      const mockUser = createMockUser({ id: testId });

      // Mock the database query
      const getMock = jest.fn().mockReturnValue(mockUser);
      (db.prepare as jest.Mock).mockReturnValue({ get: getMock });

      // Call the function with the SAME email
      const result: User | undefined = findUserById(testId);

      // Assertions
      expect(db.prepare).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?');
      expect(getMock).toHaveBeenCalledWith(testId);
      expect(result).toEqual(mockUser);
    });
    it('should return undefined when a user is not found by id', () => {
      // The email we'll search for
      const testId = 'uklghK3478t234vb234RR';

      // Mock the database query to return undefined (user not found)
      const getMock = jest.fn().mockReturnValue(undefined);
      (db.prepare as jest.Mock).mockReturnValue({ get: getMock });

      // Call the function with the test email
      const result: User | undefined = findUserById(testId);

      // Assertions
      expect(db.prepare).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?');
      expect(getMock).toHaveBeenCalledWith(testId);
      expect(result).toBeUndefined();
    });
  });
  describe('createUser', () => {
    jest.mock('uuid', () => ({
      v4: jest.fn().mockReturnValue('mocked-uuid'),
    }));

    it('should return a user after creating it', () => {
      const mockDate = '2023-01-01T00:00:00.000Z';
      jest.spyOn(global.Date.prototype, 'toISOString').mockReturnValue(mockDate);
      const mockUser: User = createMockUser();

      const runMock = jest.fn();
      (db.prepare as jest.Mock).mockReturnValue({ run: runMock });

      const result: User = createUser(mockUser);

      const {
        fullName, email, password, userType,
      } = mockUser;

      const expectedUser: User = {
        id: expect.any(String),
        fullName,
        email,
        password,
        userType,
        createdDate: mockDate,
      };

      expect(db.prepare).toHaveBeenCalledWith(
        'INSERT INTO users (id, fullName, email, password, userType, createdDate) VALUES (?,?,?,?,?,?)',
      );
      expect(result).toMatchObject(expectedUser);
    });
    it('should throw an error when the method fails', () => {
      const mockUser: User = createMockUser();

      // Mock the database query to throw an error
      const error = new Error('Database error');
      const runMock = jest.fn().mockImplementation(() => {
        throw error;
      });
      (db.prepare as jest.Mock).mockReturnValue({ run: runMock });

      expect(() => {
        createUser(mockUser);
      }).toThrow(error);
      expect(db.prepare).toHaveBeenCalledWith(
        'INSERT INTO users (id, fullName, email, password, userType, createdDate) VALUES (?,?,?,?,?,?)',
      );
    });
  });
});
