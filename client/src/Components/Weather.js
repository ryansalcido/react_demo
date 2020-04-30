import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import Divider from "@material-ui/core/Divider";
import SearchIcon from "@material-ui/icons/Search";
import WeatherService from "../Services/WeatherService";
import Typography from "@material-ui/core/Typography";
import WeatherCard from "./WeatherCard";

const useStyles = makeStyles((theme) => ({
	root: {
		marginLeft: theme.spacing(2)
	},
	locationInput: {
		flex: 1
	},
	locationRoot: {
		width: "50%",
		padding: "2px 4px",
		display: "flex",
		alignItems: "center"
	},
	inputDivider: {
		height: 28,
		margin: 4
	}
}));

const Weather = () => {
	const classes = useStyles();

	const [ location, setLocation ] = useState("");
	const [ forecast, setForecast ] = useState({});
	const [ message, setMessage ] = useState({msgBody: "", msgError: false});

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

	const getWeatherInfo = () => {
		WeatherService.getWeatherForecast({location}).then(data => {
			const { message, weatherForecast, location } = data;
			if(message.msgError === true) {
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
			<Paper className={classes.locationRoot}>
				<InputBase value={location} className={classes.locationInput} placeholder="Enter a location"
					onChange={(event) => setLocation(event.target.value)} />
				<IconButton size="small" onClick={() => setLocation("")}>
					{location !== "" && <ClearIcon />}
				</IconButton>
				<Divider className={classes.inputDivider} orientation="vertical" />
				<IconButton size="small" disabled={location === ""} color="primary" onClick={() => getWeatherInfo()}>
					<SearchIcon />
				</IconButton>
    	</Paper>

			{message.msgError === true && 
				<Typography color="error" variant="subtitle1">{message.msgBody}</Typography>
			}

			{forecast.city && forecast.list && <WeatherCard forecast={forecast} />}
		</div>
	);
};

export default Weather;