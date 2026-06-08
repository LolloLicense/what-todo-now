import type { Request, Response } from "express";
import { db } from "../config/db.js";
import type { ResultSetHeader,RowDataPacket } from "mysql2";

const formattedTodo = (rows: RowDataPacket[]) => {
	const todo = rows[0];
	if (!todo) {
		throw new Error("No todo to format");
	}
	return {
		id: todo.todo_id,
		content: todo.todo_content,
		done: todo.todo_done,
		created_at: todo.todo_created_at,
		vibe: todo.todo_vibe,
		userId: todo.todo_user_id,
		subtasks: rows
		.filter((row) => row.subtask_id !== null)
		.map((row) => {
			return {
			id: row.subtask_id,
			todo_id: row.subtask_todo_id,
			content: row.subtask_content,
			done: row.subtask_done,
			created_at: row.subtask_created_at,
			};
		}),
	};
};

export const fetchAllTodos = async (request: Request, response: Response) => {
	try {
		const userId = request.query.userId;
		if (typeof userId !== "string") {
			response.status(400).json({ error: "userId is required" });
			return;
		}
		const [results] = await db.query("SELECT * FROM todos WHERE user_id = ?",
			[userId]);
		response.json(results);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		response.status(500).json({ error: message });
	}
};

export const fetchTodo = async (request: Request, response: Response) => {
    const id = request.params.id
	const userId = request.query.userId;
	if (typeof userId !== "string") {

		response.status(400).json({ error: "userId is required" });
		return;
	}
    try {
      const [rows] = await db.query<RowDataPacket[]>(
       `SELECT
			todos.id AS todo_id,
			todos.content AS todo_content,
			todos.done AS todo_done,
			todos.vibe AS todo_vibe,
			todos.user_id AS todo_user_id,
			todos.created_at AS todo_created_at,
			subtasks.id AS subtask_id,
			subtasks.todo_id AS subtask_todo_id,
			subtasks.content AS subtask_content,
			subtasks.done AS subtask_done,
			subtasks.created_at AS subtask_created_at
			FROM todos
		LEFT JOIN subtasks ON todos.id = subtasks.todo_id
		WHERE todos.id = ?;`,
        // placeholder för att undvika injections
        [id, userId]
      );
      const todo = rows[0]
      if(!todo) {
        response.status(404).json({message: 'Todo not found'})
		return
      }
      response.json(formattedTodo(rows))
    } catch(error: unknown) {
      const message = error  instanceof Error ? error.message : 'Unknown error'
      response.status(500).json({error: message})
    }
}

export const createTodo =  async(request: Request, response: Response) => {
    const {content, vibe, userId} = request.body
    if (content === undefined || vibe === undefined || userId === undefined) {
        response.status(400).json({error: 'Content, vibe and userId is required'});
        return
        }
    try {
        const sql = `INSERT INTO todos (content, done, vibe, user_id)
        VALUES (?, ?, ?, ?) `;

        const [result] = await db.query<ResultSetHeader>(sql, [content, false, vibe, userId]);
        response.status(201).json({message: 'Todo created', newTodo: {
			id: result.insertId,
			content,
			done: false,
			vibe,
			userId,}})
        
    } catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		response.status(500).json({ error: message });
    }
}

export const updateTodo = async (request: Request, response: Response) => {
	const id = request.params.id;
	const { content, done, userId } = request.body;

	if (content === undefined || done === undefined || userId === undefined) {
		response.status(400).json({ error: "Content, done and userId is required" });
		return;
	}

	try {
		const [result] = await db.query<ResultSetHeader>(
			`
			UPDATE todos
			SET content = ?, done = ?
			WHERE id = ? AND user_id = ?
		`, [content, done, id, userId]
		);

		if (result.affectedRows === 0) {
			response.status(404).json({ message: "Todo not found" });
			return;
		}

		response.json({
			message: "Todo updated",
			updatedTodo: {
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

export const deleteTodo = async(request: Request, response: Response) => {
    const id = request.params.id
	
    try {
		const { userId } = request.body;
		if (userId === undefined) {
			response.status(400).json({ error: "userId is required" });
			return;
		}
        const sql = `DELETE FROM todos WHERE id = ? AND user_id = ?`;
        const [result] = await db.query<ResultSetHeader>(sql, [id, userId]);
        if(result.affectedRows === 0) {
            response.status(404).json({message: 'Todo not found'})
            return
        }
        response.json({message: 'Todo delete'})
    } catch (error) {
        const message = error  instanceof Error ? error.message : 'Unknown error'
        response.status(500).json({error: message})
    }
}


