export const toProperCase = (str) => {
	return str.replace(/(-|_)/g, " ").replace(/\w\S*/g, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

/**
 * @param {string} name User's name
 * 
 * @return {string} First letter of each word in user's name up to three 3 letters
 */
export const getUserInitials = (name) => {
	return name.split(" ").map(e => e[0]).join("").substring(0, 3);
};