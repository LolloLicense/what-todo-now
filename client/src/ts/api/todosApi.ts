import type { Todo } from "../types/TodoType";
import { getUserId } from "../utils/userId";

// This is the URL to our Express API
const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/todos`;

//Get 
export const getTodos = async (): Promise<Todo[]> => {
	const userId = getUserId();
	const response = await fetch(`${API_URL}?userId=${userId}`);
	if (!response.ok) {
		throw new Error("Could not fetch todos");
	}
	return response.json();
};

//Post
export const createTodo = async (content: string, vibe: string,): Promise<void> => {
	const userId = getUserId();
	const response = await fetch(API_URL,{
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			content,
			vibe,
			userId,
		}),
	});

	if (!response.ok) {
		throw new Error("Could not create todo");
	}
};

//Patch
export const updateTodoDone = async (
	id: number,
	content: string,
	done: boolean,
): Promise<void> => {
	const userId = getUserId();

	const response = await fetch(`${API_URL}/${id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			content,
			done,
			userId,
		}),
	});

	if (!response.ok) {
		throw new Error("Could not update todo");
	}
};

//Delete
export const deleteTodo = async (id: number): Promise<void> => {
	const userId = getUserId();
	const response = await fetch(`${API_URL}/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			userId,
		}),
	});
	if (!response.ok) {
		throw new Error("Could not delete todo");
	}
};