require("dotenv").config();
const express = require("express");
const spotifyRouter = express.Router();
const SpotifyWebApi = require("spotify-web-api-node");

const reactRedirectURL = process.env.NODE_ENV === "production" 
	? process.env.REACT_CLIENT_DASHBOARD_PROD
	: process.env.REACT_CLIENT_DASHBOARD_DEV;

const nodeCallbackURL = process.env.NODE_ENV === "production"
	? process.env.SPOTIFY_REDIRECT_URI_PROD
	: process.env.SPOTIFY_REDIRECT_URI_DEV;

const scopes = ["user-read-private", "user-read-email", "playlist-modify-public", "playlist-modify-private"];
const spotifyApi = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
	redirectUri: nodeCallbackURL
});

spotifyRouter.get("/login", (req, res) => {
	const html = spotifyApi.createAuthorizeURL(scopes);
	res.redirect(html+"&show_dialog=true"); 
});

spotifyRouter.get("/callback", (req, res) => {
	const { code } = req.query;
	spotifyApi.authorizationCodeGrant(code).then(data => {
		const { access_token, refresh_token, expires_in } = data.body;

		// Set the access token on the API object to use it in later calls
		spotifyApi.setAccessToken(access_token);
		spotifyApi.setRefreshToken(refresh_token);

		res.redirect(reactRedirectURL);
	}).catch(err => {
		res.redirect(reactRedirectURL);
	});
});

spotifyRouter.get("/profile", (req, res) => {
	spotifyApi.getMe().then(response => {
		res.status(200).json({profile: response.body, message: {msgBody: "Successfully retrieved user's Spotify profile", msgError: false}});
	}).catch(error => {
		res.status(401).json({message: {msgBody: "Unauthorized to get user's Spotify profile", msgError: true}});
	});
});

spotifyRouter.get("/playlists", (req, res) => {
	spotifyApi.getUserPlaylists().then(response => {
		res.status(200).json({playlists: response.body, message: {msgBody: "Successfully retrieved playlists", msgError: false}});
	}).catch(error => {
		res.status(400).json({message: {msgBody: "Unable to retrieve playlists", msgError: true}});
	});
});

spotifyRouter.get("/playlist/:id", async (req, res) => {
	const playlistId = req.params.id;
	try {
		let result = await spotifyApi.getPlaylistTracks(playlistId);
		let totalTracks = result.body.items;
		while(result.body.next !== null) {
			result = await spotifyApi.getPlaylistTracks(playlistId, {limit: result.body.limit, offset: result.body.limit + result.body.offset});
			totalTracks = [ ...totalTracks, ...result.body.items ];
		}
		res.status(200).json({tracks: totalTracks, message: {msgBody: "Successfully retrieved tracks", msgError: false}});
	} catch (err) {
		res.status(400).json({message: {msgBody: "Unable to retrieve tracks", msgError: true}});
	}
});

module.exports = spotifyRouter;