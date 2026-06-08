import type { Todo } from "../types/TodoType";
import { deleteTodo, updateTodoDone } from "../api/todosApi";
import {
	createCheckbox,
	createIcon,
	createIconButton, createVibeIcon, capitalizeFirstLetter
} from "../utils/helpers";
import {createSubtaskPanel} from "../render/renderSubtask"


export const renderTodos = (todos: Todo[], todoList: HTMLUListElement) => {

	todoList.innerHTML = "";
    for (const todo of todos) {
    
        const li = document.createElement("li");
        const subtaskPanel = createSubtaskPanel(todo);

        li.className =
	    "group rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-slate-950/30 backdrop-blur transition hover:-translate-y-0.5 hover:border-pink-400/50 hover:bg-white/10";
		
        const row = document.createElement("div");
        row.className = "flex items-center gap-6";


        // Todo content
        const text = document.createElement("p");
        text.textContent = capitalizeFirstLetter(todo.content);
        text.className = "text-base font-bold text-slate-100";
        // Vibeicon
        const vibeIcon = createVibeIcon(todo.vibe);
         
        // content group 
        const contentGroup = document.createElement("div");
        contentGroup.className = "flex flex-1 items-center gap-2";
        //Checkbox
        const checkbox = createCheckbox(

            `Mark ${todo.content} as done`,
            Boolean(todo.done),
        
        );
        checkbox.addEventListener("change", async () => {
			await updateTodoDone(todo.id, todo.content, checkbox.checked);
		
			li.classList.toggle("opacity-90", checkbox.checked);
		});


		//Delete button
        const deleteIcon = createIcon("delete.svg");
        const deleteButton = createIconButton(`Delete ${todo.content}`);
        deleteButton.addEventListener("click", async () => {
			await deleteTodo(todo.id);
			li.remove();
		});

        //View more button
        const viewMoreButtonIcon = createIcon("plus.svg");
        const viewLessButtonIcon = createIcon("minus.svg");
		const viewMoreButton = createIconButton(`View subtasks for ${todo.content}`);
		viewMoreButton.addEventListener("click", async () => {
			const isOpen = !subtaskPanel.panel.classList.contains("hidden");
			subtaskPanel.panel.classList.toggle("hidden");
            if (!isOpen) {
                await subtaskPanel.loadSubtasks();
            }
			viewMoreButton.replaceChildren(isOpen ? viewMoreButtonIcon : viewLessButtonIcon);
		});

        
        contentGroup.append(vibeIcon, text);
		viewMoreButton.append(viewMoreButtonIcon);
		deleteButton.append(deleteIcon);
		row.append(checkbox, contentGroup, deleteButton, viewMoreButton);
		li.append(row, subtaskPanel.panel);
		todoList.append(li);
    }
};