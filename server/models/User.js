const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	todos : [{type : mongoose.Schema.Types.ObjectId, ref: "Todo"}]
});

userSchema.pre("save", function(next) {
	if(this.isModified("name")) {
		this.name = this.name.trim();
	}
	if(this.isModified("email")) {
		this.email = this.email.trim().toLowerCase();
	}
	if(!this.isModified("password")) {
		return next();
	} else {
		bcrypt.hash(this.password, 10, (err, passwordHash) => {
			if(err) {
				return next(err);
			} else {
				this.password = passwordHash;
				next();
			}
		});
	}
});

userSchema.methods.comparePassword = function(password, cb) {
	bcrypt.compare(password, this.password, (err, isMatch) => {
		if(err) {
			return cb(err);
		} else {
			if(!isMatch) {
				return cb(null, isMatch);
			} else {
				return cb(null, this);
			}
		}
	});
};

module.exports = mongoose.model("User", userSchema);