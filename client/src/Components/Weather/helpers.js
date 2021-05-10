import moment from "moment";

/**
 * @param {number} date Date in epoch format
 * @param {string} format Moment format
 * 
 * @return {string} Converted date using given format
*/
export const formatDate = (date, format) => {
	return moment.unix(date).format(format);
};

/**
 * @param {number} temp Temperature in fahrenheit
 * 
 * @return {object} Calculated conversions for fahrenheit, celsius, and kelvin
 */
export const calcTempConversion = (temp) => {
	return {
		fahrenheit: Math.round(temp),
		celsius: Math.round((temp - 32) * (5 / 9)),
		kelvin: Math.round((temp - 32) * (5 / 9) + 273.15)
	};
};

/**
 * @param {number} speed Speed in imperial (mph)
 * 
 * @return {Object} Calculated conversions for imperial and metric
 */
export const calcSpeedConversion = (speed) => {
	return {
		imperial: speed.toFixed(2),
		metric: parseFloat((speed / 2.237).toFixed(2))
	};
};

/**
 * @param {array} list List returned from OWM Forecast API endpoint
 * 
 * @return {array} Array with calculated object containing 
 * 	calculated values for temp, speed, and wind unit conversions
 */
export const createWeatherList = (list) => {
	return list.map(reading => ({
		...reading,
		calc: {
			feels_like: calcTempConversion(reading.main.feels_like),
			temp: calcTempConversion(reading.main.temp),
			temp_max: calcTempConversion(reading.main.temp_max),
			temp_min: calcTempConversion(reading.main.temp_min),
			wind: calcSpeedConversion(reading.wind.speed)
		}
	}));
};