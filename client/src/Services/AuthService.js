export default {
	login: (user) => {
		return fetch("/user/login", {
			method: "post",
			body: JSON.stringify(user),
			headers: { "Content-Type": "application/json" }
		}).then(res => {
			if(res.status !== 401) {
				return res.json().then(data => data);
			} else {
				return {isAuthenticated: false, user: {name: "", email: ""}};
			}
		});
	},
	register: (user) => {
		return fetch("/user/register", {
			method: "post",
			body: JSON.stringify(user),
			headers: { "Content-Type": "application/json" }
		}).then(res => res.json())
			.then(data => data);
	},
	logout: () => {
		return fetch("/user/logout")
			.then(res => res.json())
			.then(data => data);
	},
	isAuthenticated: () => {
		return fetch("/user/authenticated")
			.then(res => {
				if(res.status !== 401) {
					return res.json().then(data => data);
				} else {
					return {isAuthenticated: false, user: {name: "", email: ""}};
				}
			});
	},
	validateEmail: (email) => {
		return fetch("/user/validateEmail", {
			method: "post",
			body: JSON.stringify(email),
			headers: { "Content-Type": "application/json" }
		}).then(res => res.json())
			.then(data => data);
	},
	updateProfile: (user) => {
		return fetch("/user/updateProfile", {
			method: "post",
			body: JSON.stringify(user),
			headers: { "Content-Type": "application/json" }
		})
			.then(res => {
				if(res.status !== 401) {
					return res.json().then(data => data);
				} else {
					return {isAuthenticated: false, user: {name: "", email: ""}};
				}
			});
	},
	changePassword: (passwords) => {
		return fetch("/user/changePassword", {
			method: "post",
			body: JSON.stringify(passwords),
			headers: { "Content-Type": "application/json" }
		}).then(res => {
			if(res.status !== 401) {
				return res.json().then(data => data);
			} else {
				return {isAuthenticated: false, user: {name: "", email: ""}};
			}
		});
	}
};