const mongoose = require("mongoose");

const CityScheme = new mongoose.Schema({
	id: {
		type: Number,
		required: true
	},
	name : {
		type : String,
		required : true
	},
	state: {
		type: String,
		required: true
	},
	country: {
		type: String,
		required: true
	},
	coord: {
		lon: {
			type: Number,
			required: true
		},
		lat: {
			type: Number,
			required: true
		}
	}
});

module.exports = mongoose.model("City", CityScheme);