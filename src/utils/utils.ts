import { User } from '../models/User';

// eslint-disable-next-line import/prefer-default-export
export const removePassword = (user: User) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
