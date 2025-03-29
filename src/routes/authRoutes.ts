import express, { Router } from 'express';
import { userSignupValidationRules } from '../middleware/validators';
import { createNewUser } from '../controllers/userController';

const router: Router = express.Router();

router.post('/registration', userSignupValidationRules, createNewUser);

export default router;
