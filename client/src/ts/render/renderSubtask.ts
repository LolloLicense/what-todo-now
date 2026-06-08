import type { Subtask } from "../types/SubtaskType";
import { createSubtask, getSubtasksByTodoId, deleteSubtask, updateSubtaskState } from "../api/subtaskApi";
import {createCheckbox, createIcon, createIconButton, capitalizeFirstLetter} from "../utils/helpers";
import type { Todo } from "../types/TodoType";

const renderSubtasks = (
	subtasks: Subtask[],
	subtaskList: HTMLUListElement,
) => {
	subtaskList.innerHTML = "";

	for (const subtask of subtasks) {
		const li = document.createElement("li");
		li.className =
			"flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100";
		const checkbox = createCheckbox(
			`Mark ${subtask.content} as done`,
			Boolean(subtask.done),
		);

		const text = document.createElement("p");
		text.textContent = capitalizeFirstLetter(subtask.content);
		text.className = "flex-1";
		if (subtask.done) {
			text.classList.add("line-through");
			li.classList.add("opacity-70");
		}

		checkbox.addEventListener("change", async () => {
			await updateSubtaskState(
				subtask.id,
				subtask.content,
				checkbox.checked,
			);
			text.classList.toggle("line-through", checkbox.checked);
			li.classList.toggle("opacity-70", checkbox.checked);
		});

		const deleteButton = createIconButton(`Delete ${subtask.content}`);
		const deleteIcon = createIcon("/delete.svg");

		deleteButton.append(deleteIcon);

		deleteButton.addEventListener("click", async () => {
			await deleteSubtask(subtask.id);
			li.remove();
		});

		li.append(checkbox, text, deleteButton);
		subtaskList.append(li);
	}
};

export const createSubtaskPanel = (todo: Todo) => {
    //SUBTASK
    const subtaskPanel = document.createElement("div");
    subtaskPanel.className =
    "mt-4 hidden rounded-2xl border border-white/10 bg-black/10 p-4";
    const subtaskForm = document.createElement("form");
    subtaskForm.className = "mb-4 flex gap-3";

    const subtaskInput = document.createElement("input");
    subtaskInput.type = "text";
    subtaskInput.placeholder = "Add subtask...";
    subtaskInput.className =
    "min-h-11 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-slate-400 outline-none focus:border-pink-400";

    const subtaskAddButton = document.createElement("button");
    subtaskAddButton.type = "submit";
    subtaskAddButton.textContent = "Add";
    subtaskAddButton.className =
    "rounded-xl border border-pink-200/40 bg-pink-600/30 px-4 text-sm font-bold text-pink-50 hover:bg-pink-300/30";
    
    const subtaskList = document.createElement("ul");
    subtaskList.className = "grid gap-2";

    subtaskForm.addEventListener("submit", async (event) => {
        event.preventDefault();
    
        const content = subtaskInput.value.trim();
    
        if (content === "") {
            return;
        }
    
        //Create in db
        await createSubtask(todo.id, content);
        // fetch all subtasks for a todo
        const subtasks = await getSubtasksByTodoId(todo.id);
        //Render in subtasklist
        renderSubtasks(subtasks, subtaskList);
        //Empty input
        subtaskInput.value = "";
	});

    subtaskForm.append(subtaskInput, subtaskAddButton);
    subtaskPanel.append(subtaskForm, subtaskList);

    const loadSubtasks = async () => {
        const subtasks = await getSubtasksByTodoId(todo.id);
        renderSubtasks(subtasks, subtaskList);
    
    };
    return {panel: subtaskPanel, loadSubtasks}
}