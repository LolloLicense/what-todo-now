import type { TodoVibe } from "./TodoVibeType";

// Describe what a todo from the API looks like
export type Todo = {
	id: number;
	content: string;
	vibe: TodoVibe;
	done: boolean | number;
	created_at?: string;
};