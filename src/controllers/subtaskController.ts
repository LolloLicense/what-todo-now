import type { Request, Response } from "express";
import { db } from "../config/db.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2";


export const fetchSubtasksByTodoId = async (
	request: Request,
	response: Response,
) => {
	const todoId = request.params.todoId;
	try {
		const [results] = await db.query<RowDataPacket[]>(
			`
			SELECT *
			FROM subtasks
			WHERE todo_id = ?
			`,
			[todoId],
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
	const { todo_id, content } = request.body;

	if (todo_id === undefined || content === undefined) {
		response.status(400).json({ error: "todo_id and content is required" });
		return;
	}

	try {
		const sql = `
			INSERT INTO subtasks (todo_id, content, done)
			VALUES (?, ?, ?)
		`;

		const [result] = await db.query<ResultSetHeader>(sql, [
			todo_id,
			content,
			false,
		]);

		response.status(201).json({
			message: "Subtask created",
			newSubtask: {
				id: result.insertId,
				todo_id,
				content,
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
	const { content, done } = request.body;

	if (content === undefined || done === undefined) {
		response.status(400).json({ error: "Content and done is required" });
		return;
	}

	try {
		const sql = `
		UPDATE subtasks
        SET content = ?, done = ?
        WHERE id = ?
		`;

		const [result] = await db.query<ResultSetHeader>(sql, [
			content,
			done,
			id,
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

export const deleteSubtask = async(request: Request, response: Response) => {
    const id = request.params.id
    try {
        const sql = `DELETE FROM subtasks WHERE id = ?`;
        const [result] = await db.query<ResultSetHeader>(sql, [id]);
        if(result.affectedRows === 0) {
            response.status(404).json({message: 'Subtask not found'})
            return
        }
        response.json({message: 'Subtask deleted'})
    } catch (error) {
        const message = error  instanceof Error ? error.message : 'Unknown error'
        response.status(500).json({error: message})
    }
}


