require("dotenv").config();
const express = require("express");
const userRouter = express.Router();
const User = require("../models/User");
const Todo = require("../models/Todo");
const passport = require("passport");
const passportConfig = require("../config/passport");
const JWT = require("jsonwebtoken");

const signToken = (userID) => {
	return JWT.sign({
		iss: "RyanMERN",
		sub: userID
	}, process.env.SECRET_OR_KEY, {expiresIn: "5s"});
};

const isFieldValid = (value) => {
	if(!value || value === "") {
		return false;
	} else {
		return true;
	}
};

userRouter.post("/validateEmail", (req, res) => {
	const { email } = req.body;
	if(!email) {
		res.status(400).json({message: {msgBody: "Missing email field", msgError: true}});
	} else {
		User.findOne({email}, (err, user) => {
			if(err) {
				res.status(500).json({message: {msgBody: "Error has occurred while validating email", msgError: true}});
			} else if(user) {
				res.status(400).json({message: {msgBody: "Email is already taken", msgError: true}});
			} else {
				res.status(200).json({message: {msgBody: "Valid email provided", msgError: false}});
			}
		});
	}
});

userRouter.post("/register", (req, res) => {
	const { name, email, password } = req.body;
	if(!isFieldValid(name) || !isFieldValid(email) || !isFieldValid(password)) {
		return res.status(400).json({message: {msgBody: "Missing required fields", msgError: true}});
	}
	const emailNormalized = email.trim().toLowerCase();
	User.findOne({email: emailNormalized}, (err, user) => {
		if(err) {
			res.status(500).json({message: {msgBody: "Error has occurred while searching database", msgError: true}});
		}
		if(user) {
			res.status(400).json({message: {msgBody: "Email is already taken", msgError: true}});
		} else {
			const newUser = new User({name: name.trim(), password, email: emailNormalized});
			newUser.save(err => {
				if(err) {
					res.status(500).json({message: {msgBody: "Error has occurred during registration", msgError: true}});
				} else {
					res.status(201).json({message: {msgBody: "Account successfully created", msgError: false}});
				}
			});
		}
	});
});

userRouter.post("/login", passport.authenticate("local", {session: false}), (req, res) => {
	if(req.isAuthenticated()) {
		const { _id, name, email } = req.user;
		const token = signToken(_id);
		const refreshToken = JWT.sign({iss: "RyanMERN", sub: _id}, process.env.REFRESH_TOKEN_SECRET);
		res.cookie("access_token", token, {httpOnly: true, sameSite: true});
		res.cookie("refresh_token", refreshToken, {httpOnly: true, sameSite: true});
		res.status(200).json({isAuthenticated: true, user: {name, email}});
	}
});

userRouter.get("/logout", (req, res) => {
	res.clearCookie("access_token");
	res.clearCookie("refresh_token");
	res.json({user: {name: "", email: ""}, success: true});
});

userRouter.get("/authenticated", passport.authenticate("jwt", {session: false}), (req, res) => {
	const { name, email } = req.user;
	res.status(200).json({isAuthenticated: true, user: {name, email}});
});

userRouter.post("/updateProfile", passport.authenticate("jwt", {session: false}), (req, res) => {
	const { email } = req.user;
	User.findOneAndUpdate({email}, {$set: req.body}, { new: true }, (err, user) => {
		if(err) {
			res.status(500).json({message: {msgBody: "Error attempting to update user profile", msgError: true}});
		} else if(user) {
			const { name, email }= user;
			res.status(200).json({
				isAuthenticated: true,
				user: {name, email},
				message: {msgBody: "Successfully updated user profile", msgError: false}
			});
		} else {
			res.status(400).json({message: {msgBody: "Something went wrong while updating user profile", msgError: true}});
		}
	});
});

userRouter.post("/changePassword", passport.authenticate("jwt", {session: false}), (req, res) => {
	const { email } = req.user;
	const { originalPassword, newPassword } = req.body;
	User.findOne({email} ,(err, user) => {
		if(err) {
			res.status(500).json({message: {msgBody: "Error attempting to change user's password", msgError: true}});
		} else if(user) {
			user.comparePassword(originalPassword, (compareError, isMatch) => { //verify given original password matches stored password
				if(compareError) {
					res.status(500).json({message: {msgBody: "Error attempting to change user's password", msgError: true}});
				} else if(isMatch === false) { //Passwords do not match
					res.status(403).json({message: {msgBody: "Original password is incorrect. Please try again.", msgError: true}});
				} else {
					user.comparePassword(newPassword, (newPassError, isMatch) => { //Check if new password matches original password
						if(newPassError) {
							res.status(500).json({message: {msgBody: "Error attempting to change user's password", msgError: true}});
						} else if(isMatch === false) { //New password does not match original password => Update password
							var updatedUser = req.user;
							updatedUser.password = newPassword;
							updatedUser.save(err => {
								if(err) {
									res.status(500).json({message: {msgBody: "Error has occurred while updating user's password", msgError: true}});
								} else { //Password was succesfully updated
									res.status(200).json({message: {msgBody: "Successfully updated user's password", msgError: false}});
								}
							});
						} else { //New password matches original password => Do not update password => send error
							res.status(400).json({message: {msgBody: "New password must not match the original password", msgError: true}});
						}
					});
				}
			});
		} else {
			res.status(400).json({message: {msgBody: "Something went wrong while changing user's password", msgError: true}});
		}
	});
});

userRouter.post("/todo", passport.authenticate("jwt", {session: false}), (req, res) => {
	const todo = new Todo(req.body);
	todo.save(err => {
		if(err) {
			res.status(500).json({message: {msgBody: "Error has occurred while searching database", msgError: true}});
		} else {
			req.user.todos.push(todo);
			req.user.save(err => {
				if(err) {
					res.status(500).json({message : {msgBody : "Error has occurred while creating todo", msgError: true}});
				} else {
					res.status(201).json({isAuthenticated : true, message : {msgBody : "Successfully created todo", msgError: false}});
				}
			});
		}
	});
});

userRouter.get("/todos", passport.authenticate("jwt", {session: false}), (req, res) => {
	User.findOne({_id: req.user._id}).populate("todos").exec((err, document) => {
		if(err) {
			res.status(500).json({message : {msgBody : "Error has occurred while retreiving todos", msgError: true}});
		} else {
			res.status(200).json({todos : document.todos, isAuthenticated : true, message: {msgBody : "Successfully retreived todos", msgError: false}});
		}
	});
});

userRouter.post("/deleteTodo", passport.authenticate("jwt", {session: false}), (req, res) => {
	const { _id } = req.body;
	Todo.findOneAndDelete({_id}, (err, todo) => {
		if(err) {
			res.status(500).json({message: {msgBody: "Error has occurred while removing todo", msgError: true}});
		} else {
			res.status(200).json({isAuthenticated : true, message: {msgBody: "Successfully deleted todo", msgError: false}});
		}
	});
});

userRouter.post("/updateTodo", passport.authenticate("jwt", {session: false}), (req, res) => {
	const { _id, name } = req.body;
	Todo.findOneAndUpdate({_id}, {name}, (err, todo) => {
		if(err) {
			res.status(500).json({message: {msgBody: "Error has occurred while updating todo", msgError: true}});
		} else {
			res.status(200).json({isAuthenticated : true, message: {msgBody: "Successfully updated todo", msgError: false}});
		}
	});
});



module.exports = userRouter;