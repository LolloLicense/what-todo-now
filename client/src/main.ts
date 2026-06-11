
import { renderTodos } from "./ts/render/renderTodos";

import { getTodos } from "./ts/api/todosApi";

import { todoList } from "./ts/utils/elements";

import { initTodoForm } from "./ts/forms/initTodoForm";

//Error message for ui
const showTodoError = () => {
	const errorMessage = document.createElement("li");

	errorMessage.textContent =
		"Could not load your todos right now. The database might be waking up — try again in a moment.";

	errorMessage.className =
		"rounded-2xl border border-pink-400/30 bg-pink-400/10 p-4 text-sm text-pink-100";

	todoList?.replaceChildren(errorMessage);
};

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
		showTodoError();
	}
};

initTodoForm(fetchTodos);
fetchTodos();