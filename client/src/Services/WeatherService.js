export default {
	getWeatherForecast: (location) => {
		return fetch("/weather/forecast", {
			method: "post",
			body: JSON.stringify(location),
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