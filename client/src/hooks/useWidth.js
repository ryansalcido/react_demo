import { useState, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";

/**
 * Custom hook that uses the window's width to determine the corresponding
 * breakpoint from Material UI: ["xs", "sm", "md", "lg", "xl"]
 * Reference: https://material-ui.com/customization/breakpoints/
 * 
 * @return {object} The width state
 * @return {object} state.theme Material UI's theme object
 * @return {number} state.width Window's width in pixels
 * @return {string} state.breakpoint Corresponding breakpoint value from Material UI's specification
 */
export const useWidth = () => {
	const [ breakpoint, setBreakpoint ] = useState("xs");
	const [ width, setWidth ] = useState(window.innerWidth);
	const theme = useTheme();

	useEffect(() => {
		const handleWindowResize = () => setWidth(window.innerWidth);
		window.addEventListener("resize", handleWindowResize);
		
		return () => window.removeEventListener("resize", handleWindowResize);
	}, []);

	useEffect(() => {
		const keys = [...theme.breakpoints.keys].reverse();
		for(const key of keys) {
			const value = theme.breakpoints.values[key];
			if(width >= value) {
				setBreakpoint(key);
				break;
			}
		}
	}, [width, theme.breakpoints.values, theme.breakpoints.keys]);

	return { theme, width, breakpoint };
};

/**
	 * Function that determines if a given breakpoint is greater than or equal to the pivot breakpoint
	 * Pivot and inclusive parameters are referencing Material UI's breakpoint keys:
	 * 	["xs", "sm", "md", "lg", "xl"]
	 * @param {object} theme Material UI's theme object
	 * @param {string} pivot Material UI breakpoint used as pivot 
	 * @param {string} inclusive Material UI breakpoint used to check if greater than or equal to pivot
	 * 
	 * @return {boolean} Returns true if inclusive is greater than or equal to pivot
	 */
export const isWidthUp = (theme, pivot, inclusive) => {
	return theme.breakpoints.keys.indexOf(inclusive) >= theme.breakpoints.keys.indexOf(pivot);
};