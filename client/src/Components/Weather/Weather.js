import React, { useState, useEffect, useContext, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import Typography from "@material-ui/core/Typography";
import WeatherCard from "./WeatherCard";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { createWeatherList } from "./helpers";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(1)
	},
	locationPaper: {
		display: "flex",
		padding: "2px 4px"
	},
	locationInput: {
		flex: 1
	},
	divider: {
		height: 28,
		margin: 4
	},
	tempToggleBtn: {
		width: 33
	}
}));

const Weather = () => {
	const classes = useStyles();

	const { manageUserSession } = useContext(AuthContext);

	const [ location, setLocation ] = useState("");
	const [ forecast, setForecast ] = useLocalStorage("weather", {});
	const [ message, setMessage ] = useState({msgBody: "", msgError: false});
	const [ tempScale, setTempScale ] = useState("fahrenheit");

	const cancelSourceRef = useRef();

	useEffect(() => {
		//If axios source ref is created => Cancel request
		return () => cancelSourceRef.current ? cancelSourceRef.current.cancel() : null;
	}, []);

	const handleTempScaleChange = (event, newTempScale) => {
		if(newTempScale !== null) {
			setTempScale(newTempScale);
		}
	};

	const getWeatherInfo = (e) => {
		e.preventDefault();
		cancelSourceRef.current = axiosInstance.CancelToken.source();
		axiosInstance.post("weather/forecast", {location}, {cancelToken: cancelSourceRef.current.token}).then(res => {
			const { weatherForecast, location } = res.data;
			if(weatherForecast && location) {
				setMessage({msgBody: "", msgError: false});
				const weatherList = createWeatherList(weatherForecast.list);
				setForecast({
					location,
					city: weatherForecast.city,
					list: weatherList.filter(reading => reading.dt_txt.indexOf("18:00:00") !== -1)
				});
				setLocation("");
			}
		}).catch(error => {
			if(error.response) {
				const { status, data } = error.response;
				if(status === 401) {
					manageUserSession({name: "", email: ""}, false);
					toast.info("Session has timed out");
				} else if(data && data.message) {
					setLocation("");
					setForecast({});
					setMessage(data.message);
				}
			}
		});
	};

	return (
		<div className={classes.root}>
			<Grid container direction="column" spacing={1}>
				<Grid container item direction="row" spacing={3}>
					<Grid item xs={8} md={7} lg={5}>
						<form onSubmit={getWeatherInfo}>
							<Paper className={classes.locationPaper}>
								<InputBase value={location} autoFocus className={classes.locationInput} placeholder="Enter a location"
									onChange={(event) => setLocation(event.target.value)} />
								<IconButton size="small" onClick={() => setLocation("")}>
									{location !== "" && <ClearIcon />}
								</IconButton>
								<Divider className={classes.divider} orientation="vertical" />
								<IconButton size="small" disabled={location === ""} color="primary" onClick={getWeatherInfo}>
									<SearchIcon />
								</IconButton>
							</Paper>
						</form>
					</Grid>
					<Grid item xs={4} md={5} lg={3}>
						<ToggleButtonGroup size="small" value={tempScale} exclusive onChange={handleTempScaleChange}>
							<ToggleButton className={classes.tempToggleBtn} value="fahrenheit">°F</ToggleButton>
							<ToggleButton className={classes.tempToggleBtn} value="celsius">°C</ToggleButton>
							<ToggleButton className={classes.tempToggleBtn} value="kelvin">K</ToggleButton>
						</ToggleButtonGroup>
					</Grid>
				</Grid>
				<Grid container item>
					<Grid item xs={12} md={9} lg={6}>
						{message.msgError === true && 
							<Typography color="error" variant="subtitle1">{message.msgBody}</Typography>
						}
					</Grid>
				</Grid>
				<Grid container item>
					<Grid item xs={12} md={10} lg={8}>
						{forecast.city && forecast.list && <WeatherCard forecast={forecast} tempScale={tempScale} />}
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default Weather;