import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	base: "/what-todo-now/",
	plugins: [tailwindcss()],
});