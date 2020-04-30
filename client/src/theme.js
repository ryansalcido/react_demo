const themeObject = {
	palette: {
		primary: { main: "#46B53F"},
		secondary: { main: "#3F84B5" },
		type: "dark"
	},
	overrides: {
		MuiAppBar: {
			root: {
				height: 40
			}
		},
		MuiTextField: {
			root: {
				width: "30%"
			}
		},
		MuiButton: {
			label: {
				color: "black"
			}
		},
		MuiSvgIcon: {
			root: {
				cursor: "pointer"
			}
		}
	}
};

export default themeObject;