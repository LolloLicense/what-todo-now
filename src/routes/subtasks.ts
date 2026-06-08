import { Router } from "express";
import {
	createSubtask,
	deleteSubtask,
	fetchSubtask,
	updateSubtask,
} from "../controllers/subtaskController.js";

const subtaskRouter = Router();

subtaskRouter.get("/:id", fetchSubtask);
subtaskRouter.post("/", createSubtask);
subtaskRouter.patch("/:id", updateSubtask);
subtaskRouter.delete("/:id", deleteSubtask);

export default subtaskRouter;