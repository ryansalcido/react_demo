import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Button from "@material-ui/core/Button";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
	divider: {
		height: 28,
		margin: 4
	},
	weatherCard: {
		width: "65%",
		marginTop: theme.spacing(3)
	},
	weatherBtnRoot: {
		width: "100%",
		"&:hover" : {
			backgroundColor: "unset"
		}
	},
	weatherBtnLabel: {
		display: "block",
		color: "unset"
	},
	tempToggleGroup: {
		paddingLeft: 2,
		minWidth: 102
	},
	tempToggleBtn: {
		width: 34
	},
	tempValue: {
		width: 58,
		height: 42
	}
}));

const WeatherCard = (props) => {
	const classes = useStyles();
	const { forecast } = props;
	const [ selectedForecast, setSelectedForecast ] = useState(forecast.list[0]);
	const [ tempScale, setTempScale ] = useState("fahrenheit");

	const formatDate = (date, format) => {
		return moment.unix(date).format(format);
	};

	const handleTempScaleChange = (event, newTempScale) => {
		if(newTempScale !== null) {
			setTempScale(newTempScale);
		}
	};

	const handleWeatherDayClick = (reading, idx) => {
		setSelectedForecast(reading);
	};

	return (
		<Fragment>
			{selectedForecast.dt && forecast.city && forecast.list && 
			<Card className={classes.weatherCard}>
				<CardContent>
					<Typography variant="h6">{forecast.location}</Typography>
					<Typography variant="body1">{formatDate(selectedForecast.dt, "dddd, MMMM Do, YYYY")}</Typography>
					<Typography variant="body2">{selectedForecast.weather[0].main}</Typography>
					<Box style={{width: "100%", paddingBottom: "24px"}} display="flex">
						<Box style={{width: "50%"}} display="flex" alignItems="center">
							<i className={`owf owf-${selectedForecast.weather[0].id}-${selectedForecast.sys.pod} owf-5x owf-fw`} />
							<Typography className={classes.tempValue} variant="h4">{selectedForecast.calc.temp[tempScale]}</Typography>
							<ToggleButtonGroup className={classes.tempToggleGroup} size="small" value={tempScale} exclusive 
								onChange={handleTempScaleChange}>
								<ToggleButton className={classes.tempToggleBtn} value="fahrenheit">°F</ToggleButton>
								<ToggleButton className={classes.tempToggleBtn} value="celsius">°C</ToggleButton>
								<ToggleButton className={classes.tempToggleBtn} value="kelvin">K</ToggleButton>
							</ToggleButtonGroup>
						</Box>
						<Box style={{width: "50%", paddingLeft: "20%"}}>
							<Typography variant="body2">Humidity: {selectedForecast.main.humidity}%</Typography>
							<Typography variant="body2">
								Wind:
								{tempScale === "fahrenheit"
									? ` ${selectedForecast.calc.wind["imperial"]} mph` 
									: ` ${selectedForecast.calc.wind["metric"]} m/s`}
							</Typography>
							{selectedForecast.rain &&
								<Typography variant="body2">
									Rain last 3 hours: {selectedForecast.rain["3h"]}mm
								</Typography>
							}
							{selectedForecast.snow &&
								<Typography variant="body2">
									Snow last 3 hours: {selectedForecast.snow["3h"]}mm
								</Typography>
							}
						</Box>
					</Box>
					<Divider />
					<Box style={{width: "100%"}} display="flex" justifyContent="flex-start">
						{forecast.list.map((reading, idx) => {
							return (
								<Fragment key={`reading-${idx}`}>
									<Box style={{width: "20%", textAlign: "center"}}>
										<Button classes={{label: classes.weatherBtnLabel, root: classes.weatherBtnRoot}}
											onClick={() => handleWeatherDayClick(reading, idx)}>
											<Typography variant="body1">{formatDate(reading.dt, "dddd")}</Typography>
											<Typography variant="body1">{formatDate(reading.dt, "MM/DD")}</Typography>
											<i className={`owf owf-${reading.weather[0].id}-d owf-3x owf-fw`} />
											<Typography variant="body2">{reading.calc.temp[tempScale]}°</Typography>
										</Button>
									</Box>
									{(forecast.list.length > idx + 1) && 
										<Divider orientation="vertical" flexItem />
									}
								</Fragment>
							);
						})}
					</Box>
				</CardContent>
			</Card>}
		</Fragment>
	);
};

WeatherCard.propTypes = {
	forecast: PropTypes.object.isRequired
};

export default WeatherCard;