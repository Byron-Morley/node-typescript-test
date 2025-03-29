export enum UserType {
  Student = 'student',
  Teacher = 'teacher',
  Parent = 'parent',
  PrivateTutor = 'private tutor',
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  userType: UserType;
  createdDate: string;
}
