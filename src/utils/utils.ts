import { User } from '../models/User';

export const removePassword = (user: User) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
