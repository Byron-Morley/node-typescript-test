import express, { Router } from 'express';
import { getUserById } from '../controllers/userController';

const router: Router = express.Router();

router.get('/:id', getUserById);

export default router;
