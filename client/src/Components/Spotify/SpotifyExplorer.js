import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import ListIcon from "@material-ui/icons/List";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import Grid from "@material-ui/core/Grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import Typography from "@material-ui/core/Typography";
import Hidden from "@material-ui/core/Hidden";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
	explorerRoot: {
		maxHeight: 414,
		overflowY: "auto"
	},
	explorePanelIcon: {
		minWidth: 30
	},
	spotifyIcon: {
		color: "#1DB954",
		paddingRight: 5
	},
	explorerButtonText: {
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		overflowX: "hidden"
	}
}));

const SpotifyExplorer = () => {
	const classes = useStyles();
	
	const playlists = useSelector(state => state.playlists);
	const profile = useSelector(state => state.profile);
	const dispatch = useDispatch();

	useEffect(() => {
		let source = axios.CancelToken.source();
		axios.get("/spotify/playlists", {cancelToken: source.token}).then(res => {
			const { playlists } = res.data;
			dispatch({playlists, type: "SET_PLAYLISTS"});
		}).catch(error => {
			dispatch({playlists: [], type: "SET_PLAYLISTS"});
		});

		return () => source.cancel();
	}, [dispatch]);

	const getTracksByPlaylist = (playlist) => {
		dispatch({isLoading: true, type: "SET_IS_LOADING"});
		dispatch({albums: [], type: "SET_ALBUMS"});
		axios.get(`/spotify/playlist/${playlist.id}`).then(res => {
			const { tracks } = res.data;
			playlist.type = "PLAYLIST";
			dispatch({tracks, type: "SET_TRACKS"});
			dispatch({selectedInfo: playlist, type: "SET_SELECTED_INFO"});
			dispatch({isLoading: false, type: "SET_IS_LOADING"});
		}).catch(error => {
			dispatch({tracks: [], type: "SET_TRACKS"});
			dispatch({selectedInfo: null, type: "SET_SELECTED_INFO"});
			dispatch({isLoading: false, type: "SET_IS_LOADING"});
		});
	};

	const getSavedTracks = () => {
		dispatch({isLoading: true, type: "SET_IS_LOADING"});
		dispatch({albums: [], type: "SET_ALBUMS"});
		axios.get("/spotify/savedTracks").then(res => {
			const { savedTracks } = res.data;
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
			dispatch({isLoading: false, type: "SET_IS_LOADING"});
		}).catch(error => {
			dispatch({tracks: [], type: "SET_TRACKS"});
			dispatch({selectedInfo: null, type: "SET_SELECTED_INFO"});
			dispatch({isLoading: false, type: "SET_IS_LOADING"});
		});
	};

	const getSavedAlbums = () => {
		dispatch({isLoading: true, type: "SET_IS_LOADING"});
		axios.get("/spotify/savedAlbums").then(res => {
			const { savedAlbums } = res.data;
			dispatch({albums: savedAlbums.items, type: "SET_ALBUMS"});
			dispatch({isLoading: false, type: "SET_IS_LOADING"});
		}).catch(error => {
			dispatch({albums: [], type: "SET_ALBUMS"});
			dispatch({isLoading: false, type: "SET_IS_LOADING"});
		});
	};

	return (
		<Grid container>
			<Grid container item alignItems="center" justify="center">
				<Grid item>
					<FontAwesomeIcon icon={faSpotify} size="2x" className={classes.spotifyIcon} />
				</Grid>
				<Hidden only="xs">
					<Grid item>
						<Typography variant="body2">SPOTIFY</Typography>
					</Grid>
				</Hidden>
			</Grid>
			
			<Grid item className={classes.explorerRoot} xs={12}>
				<ListItem dense button>
					<ListItemIcon className={classes.explorePanelIcon}><HomeIcon /></ListItemIcon>
					<ListItemText classes={{primary: classes.explorerButtonText}} primary="HOME" />
				</ListItem>
				<ListItem dense button>
					<ListItemIcon className={classes.explorePanelIcon}><SearchIcon /></ListItemIcon>
					<ListItemText classes={{primary: classes.explorerButtonText}} primary="SEARCH" />
				</ListItem>
				<ListItem dense divider>
					<ListItemIcon className={classes.explorePanelIcon}><LibraryMusicIcon /></ListItemIcon>
					<ListItemText classes={{primary: classes.explorerButtonText}} primary="YOUR LIBRARY" />
				</ListItem>
				<ListItem dense button>
					<ListItemText classes={{primary: classes.explorerButtonText}} 
						primary="Songs" onClick={() => getSavedTracks()} />
				</ListItem>
				<ListItem dense button>
					<ListItemText classes={{primary: classes.explorerButtonText}}
						primary="Albums" onClick={() => getSavedAlbums()} />
				</ListItem>
				<ListItem dense divider>
					<ListItemIcon className={classes.explorePanelIcon}><ListIcon /></ListItemIcon>
					<ListItemText classes={{primary: classes.explorerButtonText}} primary="PLAYLISTS" />
				</ListItem>
				{playlists.map((playlist) => {
					return (
						<ListItem button dense key={playlist.id}>
							<ListItemText classes={{primary: classes.explorerButtonText}}
								primary={playlist.name} onClick={() => getTracksByPlaylist(playlist)} />
						</ListItem>
					);
				})}
			</Grid>
		</Grid>
	);
};

export default SpotifyExplorer;