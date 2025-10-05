import express from 'express';
import { createToDo, getToDos, updateToDo, deleteToDo } from '../controller/todoController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const todoRouter = express.Router();

// Protected routes
todoRouter.use(authMiddleware); // apply middleware to all routes

todoRouter.post('/create', createToDo);
todoRouter.get('/', getToDos);
todoRouter.put('/update/:id', updateToDo);
todoRouter.delete('/delete/:id', deleteToDo);

export default todoRouter;
