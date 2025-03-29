import { v4 as uuidv4 } from 'uuid';
import { User, UserType } from '../models/User';

/**
 * Creates a mock user with default or custom values
 * @param overrides - Optional properties to override default values
 * @returns A mock User object
 */
export const createMockUser = (overrides?: Partial<User>): User => {
  const defaultUser: User = {
    id: uuidv4(),
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    userType: UserType.Teacher,
    createdDate: new Date().toISOString(),
  };

  return {
    ...defaultUser,
    ...overrides,
  };
};

/**
 * Creates multiple mock users
 * @param count - Number of users to create
 * @param overridesFn - Optional function to customize each user
 * @returns Array of mock User objects
 */
export const createMockUsers = (
  count: number,
  overridesFn?: (index: number) => Partial<User>,
): User[] => Array.from(
  { length: count },
  (_, index) => createMockUser(overridesFn ? overridesFn(index) : undefined),
);
