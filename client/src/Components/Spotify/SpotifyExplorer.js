import React, { Fragment, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import ListIcon from "@material-ui/icons/List";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import SpotifyService from "../../Services/SpotifyService";

const useStyles = makeStyles((theme) => ({
	explorePanelIcon: {
		minWidth: 30,
		"& .MuiSvgIcon-root": {
			cursor: "auto"
		}
	},
	spotifyLogo: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	},
	spotifyIcon: {
		color: "#1DB954",
		paddingRight: 5
	}
}));

const SpotifyExplorer = () => {
	const classes = useStyles();
	
	const playlists = useSelector(state => state.playlists);
	const profile = useSelector(state => state.profile);
	const dispatch = useDispatch();

	useEffect(() => {
		SpotifyService.getPlaylists().then(data => {
			const { playlists, message } = data;
			if(message.msgError === false) {
				dispatch({playlists, type: "SET_PLAYLISTS"});
			} else {
				dispatch({playlists: [], type: "SET_PLAYLISTS"});
			}
		});
	}, [dispatch]);

	const getTracksByPlaylist = (playlist) => {
		dispatch({isLoading: true, type: "SET_IS_LOADING"});
		SpotifyService.getTracksByPlaylist(playlist.id).then(data => {
			const { tracks, message } = data;
			if(message.msgError === false) {
				playlist.type = "PLAYLIST";
				dispatch({tracks, type: "SET_TRACKS"});
				dispatch({selectedInfo: playlist, type: "SET_SELECTED_INFO"});
			} else {
				dispatch({tracks: [], type: "SET_TRACKS"});
				dispatch({selectedInfo: null, type: "SET_SELECTED_INFO"});
			}
			dispatch({albums: [], type: "SET_ALBUMS"});
			dispatch({isLoading: false, type: "SET_IS_LOADING"});
		});
	};

	const getSavedTracks = () => {
		dispatch({isLoading: true, type: "SET_IS_LOADING"});
		SpotifyService.getSavedTracks().then(data => {
			const { savedTracks, message } = data;
			if(message.msgError === false) {
				dispatch({tracks: savedTracks, type: "SET_TRACKS"});
				dispatch({
					selectedInfo: {
						images: [{url: "https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"}],
						name: "Liked Songs",
						type: "PLAYLIST",
						owner: { display_name: profile.display_name },
						tracks: { total: savedTracks.length }
					}, 
					type: "SET_SELECTED_INFO"
				});
			} else {
				dispatch({tracks: [], type: "SET_TRACKS"});
				dispatch({selectedInfo: null, type: "SET_SELECTED_INFO"});
			}
			dispatch({albums: [], type: "SET_ALBUMS"});
			dispatch({isLoading: false, type: "SET_IS_LOADING"});
		});
	};

	const getSavedAlbums = () => {
		dispatch({isLoading: true, type: "SET_IS_LOADING"});
		SpotifyService.getSavedAlbums().then(data => {
			const { savedAlbums, message } = data;
			if(message.msgError === false) {
				dispatch({albums: savedAlbums.items, type: "SET_ALBUMS"});
			} else {
				dispatch({albums: [], type: "SET_ALBUMS"});
			}
			dispatch({tracks: [], type: "SET_TRACKS"});
			dispatch({selectedInfo: null, type: "SET_SELECTED_INFO"});
			dispatch({isLoading: false, type: "SET_IS_LOADING"});
		});
	};

	return (
		<Fragment>
			<div className={classes.spotifyLogo}>
				<FontAwesomeIcon icon={faSpotify} size="2x" className={classes.spotifyIcon} />
				<span>SPOTIFY</span>
			</div>
			<List dense disablePadding>
				<ListItem button>
					<ListItemIcon className={classes.explorePanelIcon}><HomeIcon /></ListItemIcon>
					<ListItemText primary="HOME" />
				</ListItem>
				<ListItem button>
					<ListItemIcon className={classes.explorePanelIcon}><SearchIcon /></ListItemIcon>
					<ListItemText primary="SEARCH" />
				</ListItem>
				<ListItem divider>
					<ListItemIcon className={classes.explorePanelIcon}><LibraryMusicIcon /></ListItemIcon>
					<ListItemText primary="YOUR LIBRARY" />
				</ListItem>
				<ListItem button>
					<ListItemText primary="Songs" onClick={() => getSavedTracks()} />
				</ListItem>
				<ListItem button>
					<ListItemText primary="Albums" onClick={() => getSavedAlbums()} />
				</ListItem>
				<ListItem divider>
					<ListItemIcon className={classes.explorePanelIcon}><ListIcon /></ListItemIcon>
					<ListItemText primary="PLAYLISTS" />
				</ListItem>
				{playlists.map((playlist) => {
					return (
						<Fragment key={playlist.id} >
							<ListItem button dense>
								<ListItemText primary={playlist.name} onClick={() => getTracksByPlaylist(playlist)} />
							</ListItem>
						</Fragment>
					);
				})}
			</List>
		</Fragment>
	);
};

export default SpotifyExplorer;