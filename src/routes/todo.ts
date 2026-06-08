import express, { Router } from "express"
import {
    createTodo,
    deleteTodo,
    fetchAllTodos,
    fetchTodo,
    updateTodo
} from '../controllers/todoController.js'
import { fetchSubtasksByTodoId } from "../controllers/subtaskController.js";

const router = express.Router()

router.get('/', fetchAllTodos)
router.post('/', createTodo)

router.get("/:todoId/subtasks", fetchSubtasksByTodoId);

router.get('/:id', fetchTodo)
router.patch('/:id', updateTodo)
router.delete('/:id', deleteTodo)

export default router