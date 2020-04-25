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
	}, process.env.SECRET_OR_KEY, {expiresIn: "1h"});
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
			const newUser = new User({name, password, email: emailNormalized});
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
		res.cookie("access_token", token, {httpOnly: true, sameSite: true});
		res.status(200).json({isAuthenticated: true, user: {name, email}});
	}
});

userRouter.get("/logout", passport.authenticate("jwt", {session: false}), (req, res) => {
	res.clearCookie("access_token");
	res.json({user: {name: "", email: ""}, success: true});
});

userRouter.get("/authenticated", passport.authenticate("jwt", {session: false}), (req, res) => {
	const { name, email } = req.user;
	res.status(200).json({isAuthenticated: true, user: {name, email}});
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