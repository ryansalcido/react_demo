import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { formatDate } from "./helpers";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: 16
	},
	weatherMainContainer: {
		borderRight: `1px solid ${theme.palette.divider}`
	},
	dailyForecastGrid: {
		textAlign: "center"
	},
	weatherBtnRoot: {
		width: "100%"
	},
	weatherBtnLabel: {
		color: theme.palette.type === "dark" ? "white" : "black"
	},
	dailyWeatherIconItem: {
		display: "flex",
		justifyContent: "center"
	},
	fiveDayForecastContainer: {
		minHeight: 65
	}
}));

const WeatherCard = (props) => {
	const classes = useStyles();
	const { forecast, tempScale } = props;
	const [ selectedForecast, setSelectedForecast ] = useState({});
	const atLeastSmWith = useMediaQuery(theme => theme.breakpoints.up("sm"));

	useEffect(() => {
		setSelectedForecast(forecast.list[0]);
	}, [forecast]);

	const handleWeatherDayClick = (reading, idx) => {
		setSelectedForecast(reading);
	};

	return (
		<Fragment>
			{selectedForecast.dt && forecast.city && forecast.list &&
			<Paper className={classes.root}>
				<Grid container spacing={1}>
					<Grid item xs={12} sm={6} className={atLeastSmWith ? classes.weatherMainContainer : null}>
						<Typography variant="h6">{forecast.location}</Typography>
						<Typography variant="body1">{formatDate(selectedForecast.dt, "dddd, MMMM Do, YYYY")}</Typography>
						<Typography variant="body1">{selectedForecast.weather[0].main}</Typography>
						<Grid container item alignItems="center">
							<Grid item>
								<img src={`https://openweathermap.org/img/wn/${selectedForecast.weather[0].icon}@2x.png`} 
									alt="Weather" width="100" height="100" />
							</Grid>
							<Grid item>
								<Typography variant="h4">
									{selectedForecast.calc.temp[tempScale]}{tempScale !== "kelvin" && "°"}{tempScale.charAt(0).toUpperCase()}
								</Typography>
							</Grid>
						</Grid>
						<Typography variant="body1">Humidity: {selectedForecast.main.humidity}%</Typography>
						<Typography variant="body1">
							Wind:
							{tempScale === "fahrenheit"? ` ${selectedForecast.calc.wind["imperial"]} mph` 
								: ` ${selectedForecast.calc.wind["metric"]} m/s`}
						</Typography>
						{selectedForecast.rain &&
							<Typography variant="body1">Rain last 3 hours: {selectedForecast.rain["3h"]}mm</Typography>
						}
						{selectedForecast.snow &&
							<Typography variant="body1">Snow last 3 hours: {selectedForecast.snow["3h"]}mm</Typography>
						}
					</Grid>
					<Grid item xs={12} sm={6} className={classes.dailyForecastGrid}>
						{!atLeastSmWith && <Divider />}
						{forecast.list.map((reading, idx) => {
							return (
								<Fragment key={`reading-${idx}`}>
									<Grid container item justify="space-between" alignItems="center" className={classes.fiveDayForecastContainer}>
										<Button classes={{root: classes.weatherBtnRoot, label: classes.weatherBtnLabel}}
											onClick={() => handleWeatherDayClick(reading, idx)}>
											<Grid item xs={4}>
												<Typography variant="body1">{formatDate(reading.dt, "ddd. MM/DD")}</Typography>
											</Grid>
											<Grid item xs={4} className={classes.dailyWeatherIconItem}>
												<img src={`https://openweathermap.org/img/wn/${reading.weather[0].icon}.png`}
													alt="Weather" width="45" height="45" />
											</Grid>
											<Grid item xs={4}>
												<Typography variant="body1">
													{reading.calc.temp[tempScale]}{tempScale !== "kelvin" && "°"}{tempScale.charAt(0).toUpperCase()}
												</Typography>
											</Grid>
										</Button>
									</Grid>
									{(forecast.list.length > idx + 1) && <Divider />}
								</Fragment>
							);
						})}
					</Grid>
				</Grid>
			</Paper>}
		</Fragment>
	);
};

WeatherCard.propTypes = {
	forecast: PropTypes.object.isRequired,
	tempScale: PropTypes.string.isRequired
};

export default WeatherCard;