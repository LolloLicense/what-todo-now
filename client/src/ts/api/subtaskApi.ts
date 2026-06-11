import type { Subtask } from "../types/SubtaskType";
import { getUserId } from "../utils/userId";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const SUBTASK_API_URL = `${API_BASE_URL}/subtasks`;
const TODO_API_URL = `${API_BASE_URL}/todos`;

// Get subtasks connected to one todo
export const getSubtasksByTodoId = async (
	todoId: number,
): Promise<Subtask[]> => {
	const userId = getUserId();

	const response = await fetch(`${TODO_API_URL}/${todoId}/subtasks?userId=${userId}`);

	if (!response.ok) {
		throw new Error("Could not fetch subtasks");
	}

	return response.json();
};

//Post
export const createSubtask = async (
    todoId : number,
    content: string,
): Promise<void> => {
	const userId = getUserId();

    const response = await fetch(SUBTASK_API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({
            todo_id: todoId,
            content,
			userId,
        })
    })
    if(!response.ok){
        throw new Error("Could not create subtask")
    }
}

// Patch
export const updateSubtaskState = async (
	id: number,
	content: string,
	done: boolean,
): Promise<void> => {
	const userId = getUserId();
	const response = await fetch(`${SUBTASK_API_URL}/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			content,
			done,
			userId,
		}),
	});
	if (!response.ok) {
		throw new Error("Could not update subtask");
	}
};

// Delete
export const deleteSubtask = async (id: number): Promise<void> => {
	const userId = getUserId();

	const response = await fetch(`${SUBTASK_API_URL}/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			userId,
		}),
	});

	if (!response.ok) {
		throw new Error("Could not delete subtask");
	}
};