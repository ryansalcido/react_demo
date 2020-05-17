import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import Typography from "@material-ui/core/Typography";
import WeatherService from "../../Services/WeatherService";
import WeatherCard from "./WeatherCard";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import AuthService from "../../Services/AuthService";
import { AuthContext } from "../../Context/AuthContext";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

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

	const history = useHistory();
	const { setUser, setIsAuthenticated } = useContext(AuthContext);

	const [ location, setLocation ] = useState("");
	const [ forecast, setForecast ] = useState({});
	const [ message, setMessage ] = useState({msgBody: "", msgError: false});
	const [ tempScale, setTempScale ] = useState("fahrenheit");

	useEffect(() => {
		if(localStorage.getItem("weather")) {
			const dailyWeather = JSON.parse(localStorage.getItem("weather"));
			setForecast(dailyWeather);
		}
	}, []);

	const calcTempConversion = (temp) => {
		return {
			fahrenheit: Math.round(temp),
			celsius: Math.round((temp - 32) * (5 / 9)),
			kelvin: Math.round((temp - 32) * (5 / 9) + 273.15)
		};
	};

	const calcSpeedConversion = (speed) => {
		return {
			imperial: speed.toFixed(2),
			metric: parseFloat((speed / 2.237).toFixed(2))
		};
	};

	const handleTempScaleChange = (event, newTempScale) => {
		if(newTempScale !== null) {
			setTempScale(newTempScale);
		}
	};

	const getWeatherInfo = (e) => {
		e.preventDefault();
		WeatherService.getWeatherForecast({location}).then(data => {
			const { message, weatherForecast, location, isAuthenticated } = data;
			if(isAuthenticated === false) {
				AuthService.logout().then(data => {
					if(data.success) {
						toast.info("Session has expired. Please log back in.");
						setUser(data.user);
						setIsAuthenticated(false);
					} else {
						toast.error("Error occurred due to expired sesion.");
					}
					history.push("/login");
				});
			} else if(message.msgError === true) {
				setForecast({});
				setMessage(message);
			} else {
				setMessage({msgBody: "", msgError: false});
				weatherForecast.list.forEach((reading) => {
					reading.calc = {};
					reading.calc.feels_like = calcTempConversion(reading.main.feels_like);
					reading.calc.temp = calcTempConversion(reading.main.temp);
					reading.calc.temp_max = calcTempConversion(reading.main.temp_max);
					reading.calc.temp_min = calcTempConversion(reading.main.temp_min);
					reading.calc.wind = calcSpeedConversion(reading.wind.speed);
					reading.calc.local_time = reading.dt + weatherForecast.city.timezone;
				});
				const dailyWeather = {
					location,
					city: weatherForecast.city,
					list: weatherForecast.list.filter(reading => reading.dt_txt.indexOf("18:00:00") !== -1)
				};
				localStorage.setItem("weather", JSON.stringify(dailyWeather));
				setForecast(dailyWeather);
			}
			setLocation("");
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