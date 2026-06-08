
import { renderTodos } from "./ts/render/renderTodos";

import { getTodos } from "./ts/api/todosApi";

import { todoList } from "./ts/utils/elements";

import { initTodoForm } from "./ts/forms/initTodoForm";




// Fetch all todos from the backend API
const fetchTodos = async () => {
	if(!todoList) {
		return
	}
	try {
		const todos = await getTodos();

		renderTodos(todos, todoList);

	} catch (error) {
		console.log(error);
	}
};

initTodoForm(fetchTodos);
fetchTodos();