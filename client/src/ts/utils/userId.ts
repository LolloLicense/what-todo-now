const USER_ID_KEY = "what-todo-now-user-id";

export const getUserId = () => {
	let userId = localStorage.getItem(USER_ID_KEY);

	if (!userId) {
		userId = crypto.randomUUID();
		localStorage.setItem(USER_ID_KEY, userId);
	}

	return userId;
};