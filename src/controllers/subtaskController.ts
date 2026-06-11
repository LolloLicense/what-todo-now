import type { Request, Response } from "express";
import { db } from "../config/db.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2";


export const fetchSubtasksByTodoId = async (
	request: Request,
	response: Response,
) => {
	const todoId = request.params.todoId;
	const userId = request.query.userId;
	if (typeof userId !== "string") {
		response.status(400).json({ error: "userId is required" });
		return;
	}
	try {
		const [results] = await db.query<RowDataPacket[]>(
			`
			SELECT subtasks.*
			FROM subtasks
			INNER JOIN todos ON subtasks.todo_id = todos.id
			WHERE subtasks.todo_id = ? AND todos.user_id = ?
			`,
			[todoId, userId],
		);
		response.json(results);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		response.status(500).json({ error: message });
	}
};

export const fetchSubtask = async (request: Request, response: Response) => {
    const id = request.params.id

    try {
      const [results] = await db.query<RowDataPacket[]>(
        `SELECT * FROM subtasks WHERE id = ?`,
        // placeholder för att undvika injections
        [id]
      );
      const subtask = results[0]
      if(!subtask) {
        response.status(404).json({message: 'Subtask not found'})
        return
      } 

      response.json(subtask)
    } catch(error: unknown) {
      const message = error  instanceof Error ? error.message : 'Unknown error'
      response.status(500).json({error: message})
    }
}

export const createSubtask = async (request: Request, response: Response) => {
	const { todo_id, content, userId } = request.body;

	if (
		todo_id === undefined ||
		typeof content !== "string" ||
		content.trim() === "" ||
		typeof userId !== "string"
	) {
		response
			.status(400)
			.json({ error: "todo_id, content and userId is required" });
		return;
	}

	try {
		// 1. Check that this todo exists and belongs to this user
		const [todoResults] = await db.query<RowDataPacket[]>(
			`
			SELECT id
			FROM todos
			WHERE id = ? AND user_id = ?
			`,
			[todo_id, userId],
		);

		if (todoResults.length === 0) {
			response.status(404).json({ message: "Todo not found" });
			return;
		}

		// 2. If the todo belongs to this user, create the subtask
		const sql = `
			INSERT INTO subtasks (todo_id, content, done)
			VALUES (?, ?, ?)
		`;

		const [result] = await db.query<ResultSetHeader>(sql, [
			todo_id,
			content.trim(),
			false,
		]);

		response.status(201).json({
			message: "Subtask created",
			newSubtask: {
				id: result.insertId,
				todo_id,
				content: content.trim(),
				done: false,
			},
		});
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		response.status(500).json({ error: message });
	}
};

export const updateSubtask = async (request: Request, response: Response) => {
	const id = request.params.id;
	const { content, done, userId } = request.body;

	if (
		typeof content !== "string" ||
		typeof done !== "boolean" ||
		typeof userId !== "string"
	) {
		response.status(400).json({ error: "Content, done and userId is required" });
		return;
	}

	try {
		const sql = `
		UPDATE subtasks
		INNER JOIN todos ON subtasks.todo_id = todos.id
		SET subtasks.content = ?, subtasks.done = ?
		WHERE subtasks.id = ? AND todos.user_id = ?
		`;

		const [result] = await db.query<ResultSetHeader>(sql, [
			content,
			done,
			id,
			userId,
		]);

		if (result.affectedRows === 0) {
			response.status(404).json({ message: "Subtask not found" });
			return;
		}

		response.json({
			message: "Subtask updated",
			updatedSubtask: {
				id: Number(id),
				content,
				done,
			},
		});
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		response.status(500).json({ error: message });
	}
};

export const deleteSubtask = async (request: Request, response: Response) => {
	const id = request.params.id;
	const { userId } = request.body;

	if (typeof userId !== "string") {
		response.status(400).json({ error: "userId is required" });
		return;
	}

	try {
		const sql = `
			DELETE subtasks
			FROM subtasks
			INNER JOIN todos ON subtasks.todo_id = todos.id
			WHERE subtasks.id = ? AND todos.user_id = ?
		`;

		const [result] = await db.query<ResultSetHeader>(sql, [id, userId]);

		if (result.affectedRows === 0) {
			response.status(404).json({ message: "Subtask not found" });
			return;
		}

		response.json({ message: "Subtask deleted" });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		response.status(500).json({ error: message });
	}
};


