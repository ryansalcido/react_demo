require("dotenv").config();
const JWT = require("jsonwebtoken");

const validateToken = (req, res, next) => {
	const token = req.cookies.access_token;
	if(token) {
		JWT.verify(token, process.env.SECRET_OR_KEY, (err, decoded) => {
			if(err) {
				const { name } = err;
				if(name === "TokenExpiredError") {
					JWT.verify(token, process.env.SECRET_OR_KEY, {ignoreExpiration: true}, (verifyErr, payload) => {
						if(verifyErr) {
							console.log("Error verifying original token: ", verifyErr);
						} else if(payload) {
							const { sub, iss } = payload;
							console.log("Token is valid, but has expired");
							const refreshToken = req.cookies.refresh_token;
							if(refreshToken) {
								JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (refreshErr, refreshPayload) => {
									if(refreshErr) {
										console.log("Error verifying refresh token: ", refreshErr);
									} else if(refreshPayload) {
										console.log("Refresh token is valid");
										const newToken = JWT.sign({sub, iss}, process.env.SECRET_OR_KEY, {expiresIn: "5s"});
										req.cookies.access_token = newToken;
										res.clearCookie("access_token");
										res.cookie("access_token", newToken, {httpOnly: true, sameSite: true});
									} else {
										console.log("Could not verify refresh token");
									}
								});
							} else {
								console.log("Refresh token not found");
							}
						} else {
							console.log("Could not verify token");
						}
					});
				} else {
					console.log("Other error: ", name);
				}
			} else if(decoded) {
				console.log("Decoded token: ", decoded);
			} else {
				console.log("Unable to decode token");
			}
		});
	} else {
		console.log("Token not found");
	}
	next();
};

module.exports = validateToken;