import { body, ValidationChain } from 'express-validator';
import { UserType } from '../models/User';

export const userSignupValidationRules: ValidationChain[] = [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8, max: 64 })
    .withMessage('Password must be between 8 and 64 characters')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one digit')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter'),
  body('userType').notEmpty().withMessage('User type is required')
    .isIn(Object.values(UserType))
    .withMessage('User type must be one of: student, teacher, parent, private tutor'),
];
