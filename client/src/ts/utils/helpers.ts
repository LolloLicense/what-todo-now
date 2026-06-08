import type { TodoVibe } from "../types/TodoVibeType";

const iconBasePath = import.meta.env.BASE_URL;
export const getPublicAssetPath = (filename: string) => {
	return `${import.meta.env.BASE_URL}${filename}`;
};

export const vibeIcons: Record<TodoVibe, string> = {
	quick: `${iconBasePath}quick.svg`,
	adulting: `${iconBasePath}adulting.svg`,
	cursed: `${iconBasePath}cursed.svg`,
	iconic: `${iconBasePath}iconic.svg`,
};

export const createVibeIcon = (vibe: TodoVibe) => {
	const icon = document.createElement("img")
	icon.src = vibeIcons[vibe]
	icon.alt = ""
	icon.className = "h-5 w-5"
	return icon
}

export const createIcon = (filename: string) => {
	const icon = document.createElement("img");
	icon.src = getPublicAssetPath(filename);
	icon.alt = "";
	icon.className = "h-4 w-4";

	return icon;
};

export const createIconButton = (ariaLabel: string) => {
	const button = document.createElement("button");

	button.type = "button";
	button.className = "grid h-9 w-9 place-items-center border-none";
	button.setAttribute("aria-label", ariaLabel);

	return button;
};

export const createCheckbox = (ariaLabel: string, checked = false) => {

	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked = checked;
	checkbox.className =
		"h-5 w-5 cursor-pointer appearance-none rounded-lg border border-white/30 bg-white checked:border-pink-400 checked:bg-pink-400";
	checkbox.setAttribute("aria-label", ariaLabel);
	return checkbox;

};

export const capitalizeFirstLetter = (text: string) => {
	return text.charAt(0).toUpperCase() + text.slice(1);
};

