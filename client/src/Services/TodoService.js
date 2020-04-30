export default {
	createTodo: (todo) => {
		return fetch("/user/todo", {
			method: "post",
			body: JSON.stringify(todo),
			headers: { "Content-Type": "application/json" }
		}).then(res => {
			if(res.status === 401) {
				return {isAuthenticated: false, user: {name: "", email: ""}};
			} else {
				return res.json().then(data => data);
			}
		});
	},
	getTodos: () => {
		return fetch("/user/todos", {
			method: "get",
			headers: { "pragma": "no-cache", "cache-control": "no-cache" }
		}).then(res => {
			if(res.status === 401) {
				return {isAuthenticated: false, user: {name: "", email: ""}};
			} else {
				return res.json().then(data => data);
			}
		});
	},
	deleteTodo: (todo) => {
		return fetch("/user/deleteTodo", {
			method: "post",
			body: JSON.stringify(todo),
			headers: { "Content-Type": "application/json" }
		}).then(res => {
			if(res.status === 401) {
				return {isAuthenticated: false, user: {name: "", email: ""}};
			} else {
				return res.json().then(data => data);
			}
		});
	},
	updateTodo: (todo) => {
		return fetch("/user/updateTodo", {
			method: "post",
			body: JSON.stringify(todo),
			headers: { "Content-Type": "application/json" }
		}).then(res => {
			if(res.status === 401) {
				return {isAuthenticated: false, user: {name: "", email: ""}};
			} else {
				return res.json().then(data => data);
			}
		});
	}
};