import { Router } from 'express';
import { SignUp, LogIn, LogOut } from '../controller/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Auth routes
router.post('/signup', SignUp);
router.post('/login', LogIn);
router.post('/logout', authMiddleware, LogOut); // protect logout route

export default router;
