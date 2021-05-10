import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export const useForm = (initState, callback) => {
	const [ state, setState ] = useState(initState);

	const handleChange = (e) => {
		e.persist();
		setState(state => ({...state, [e.target.name]: e.target.value}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		callback();
	};

	return  [ state, setState, handleChange, handleSubmit ];
};

/**
 * @param {string} email Email to be validated against express endpoint
 * 
 * @return {Promise.<Object>} Returns an object with 
*  	message body (msgBody) as a @string and message error (msgError) as a @boolean
 */
export const validateEmail = (email) => {
	return new Promise((resolve, reject) => {
		const normalized = email.trim().toLowerCase();
		if(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(normalized)) {
			axiosInstance.post("user/validateEmail", {email: normalized}).then(res => {
				resolve({msgBody: "", msgError: false });
			}).catch(error => {
				const { data } = error && error.response;
				data && data.message 
					? resolve(data.message) 
					: resolve({msgBody: "Unable to validate email", msgError: true});
			});
		} else {
			resolve({msgBody: "Invalid email address format", msgError: true});
		}
	});
};

export const validateName = (name) => {
	return /^[\w\-\s]+$/.test(name)
		? { msgBody: "", msgError: false} 
		: { msgBody: "Valid characters are A-Z a-z 0-9 _ -", msgError: true };
};