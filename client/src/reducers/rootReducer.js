const initState = {
	profile: {},
	playlists: [],
	tracks: [],
	selectedInfo: null,
	isLoading: false,
	albums: []
};

function rootReducer(state = initState, action) {
	switch(action.type) {
		case "SET_PROFILE":
			return { ...state, profile: action.profile };
		case "SET_PLAYLISTS":
			return { ...state, playlists: action.playlists };
		case "SET_TRACKS":
			return { ...state, tracks: action.tracks };
		case "SET_SELECTED_INFO":
			return { ...state, selectedInfo: action.selectedInfo };
		case "SET_IS_LOADING":
			return { ...state, isLoading: action.isLoading };
		case "SET_ALBUMS":
			return { ...state, albums: action.albums};
		default:
			return state;
	}
}

export default rootReducer;