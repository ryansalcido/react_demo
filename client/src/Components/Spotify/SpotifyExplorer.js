import React, { useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import ListIcon from "@material-ui/icons/List";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import Grid from "@material-ui/core/Grid";
import { SpotifyContext } from "../../Context/SpotifyContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import Typography from "@material-ui/core/Typography";
import Hidden from "@material-ui/core/Hidden";
import axiosInstance from "../../utils/axiosInstance";

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

	const { profile, playlists, setPlaylists, setViewInfo, setIsLoading, setError } = useContext(SpotifyContext);

	useEffect(() => {
		let source = axiosInstance.CancelToken.source();
		axiosInstance.get("spotify/playlists", {cancelToken: source.token}).then(res => {
			const { playlists } = res.data;
			setPlaylists(playlists);
		}).catch(error => {
			setPlaylists(null);
		});

		return () => source.cancel();
	}, [setPlaylists]);

	const getTracksByPlaylist = (playlist) => {
		setIsLoading(true);
		axiosInstance.get(`spotify/playlist/${playlist.id}`).then(res => {
			const { tracks } = res.data;
			setError(null);
			setViewInfo({playlist, type: "PLAYLIST", content: tracks});
			setIsLoading(false);
		}).catch(error => {
			setError(error);
			setViewInfo(null);
			setIsLoading(false);
		});
	};

	const getSavedTracks = () => {
		setIsLoading(true);
		axiosInstance.get("spotify/savedTracks").then(res => {
			const { savedTracks } = res.data;
			setError(null);
			setViewInfo({
				type: "PLAYLIST",
				content: savedTracks,
				playlist: {
					images: [{url: "https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"}],
					name: "Liked Songs",
					owner: { display_name: profile.display_name },
					tracks: { total: savedTracks.length }
				}
			});
			setIsLoading(false);
		}).catch(error => {
			setError(error);
			setViewInfo(null);
			setIsLoading(false);
		});
	};

	const getSavedAlbums = () => {
		setIsLoading(true);
		axiosInstance.get("spotify/savedAlbums").then(res => {
			const { savedAlbums } = res.data;
			setError(null);
			setViewInfo({albums: savedAlbums.items, type: "ALBUM"});
			setIsLoading(false);
		}).catch(error => {
			setError(error);
			setViewInfo(null);
			setIsLoading(false);
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
				{playlists && playlists.map((playlist) => {
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