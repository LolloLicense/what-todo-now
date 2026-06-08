export type Subtask = {
	id: number;
	todo_id: number;
	content: string;
	done: boolean | number;
	created_at?: string;
};
