import { useState } from "react";
import themeObject from "../theme";

export const useDarkTheme = () => {
	if(localStorage.getItem("type")) {
		themeObject.palette.type = localStorage.getItem("type");
	}
	const [ theme, setTheme ] = useState(themeObject);

	const { palette: { type }} = theme;
	const toggleDarkTheme = () => {
		const updatedTheme = {
			...theme,
			palette: {
				...theme.palette,
				type: type === "light" ? "dark" : "light"
			}
		};
		localStorage.setItem("type", updatedTheme.palette.type);
		setTheme(updatedTheme);
	};
	return [ theme, toggleDarkTheme ];
};