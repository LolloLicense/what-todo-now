import { createTodo } from "../api/todosApi";
import { todoForm, todoInput, vibeSelect } from "../utils/elements";


export const initTodoForm = (onTodoCreated : () => Promise<void>) =>{
    todoForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        if (!todoInput || !vibeSelect) {
            return;
        }
        const content = todoInput.value.trim();
        const vibe = vibeSelect.value;
        
        if (content === "" || vibe === "") {
            return;
        }
        
        await createTodo(content, vibe);
    
        await onTodoCreated();
    
        todoInput.value = "";
    });  
}
