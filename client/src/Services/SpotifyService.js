export default {
	getProfile: () => {
		return fetch("/spotify/profile")
			.then(res => res.json())
			.then(data => data);
	},
	getPlaylists: () => {
		return fetch("/spotify/playlists")
			.then(res => res.json())
			.then(data => data);
	},
	getTracksByPlaylist: (playlistId) => {
		return fetch(`/spotify/playlist/${playlistId}`)
			.then(res => res.json())
			.then(data => data);
	},
	getSavedTracks: () => {
		return fetch("/spotify/savedTracks")
			.then(res => res.json())
			.then(data => data);
	},
	getSavedAlbums: () => {
		return fetch("/spotify/savedAlbums")
			.then(res => res.json())
			.then(data => data);
	}
};