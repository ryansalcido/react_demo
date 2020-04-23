require("dotenv").config();
const express = require("express");
const userRouter = express.Router();
const User = require("../models/User");
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

userRouter.post("/checkUsername", (req, res) => {
  User.findOne(req.body, (err, user) => {
    if(err) {
      res.status(500).json({message: {msgBody: "Error has occurred while checking username.", msgError: true}});
    } else if(user) {
      res.status(400).json({message: {msgBody: "Username is already taken", msgError: true}});
    } else {
      res.status(200).json({message: {msgBody: "Valid username provided", msgError: false}});
    }
  });
});

userRouter.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  if(!isFieldValid(username) || !isFieldValid(email) || !isFieldValid(password)) {
    return res.status(400).json({message: {msgBody: "Missing required fields.", msgError: true}});
  }
  const emailNormalized = email.trim().toLowerCase();
  User.findOne({username}, (err, user) => {
    if(err) {
      res.status(500).json({message: {msgBody: "Error has occurred while searching database.", msgError: true}});
    }
    if(user) {
      res.status(400).json({message: {msgBody: "Username is already taken.", msgError: true}});
    } else {
      const newUser = new User({username, password, email: emailNormalized});
      newUser.save(err => {
        if(err) {
          res.status(500).json({message: {msgBody: "Error has occurred during registration.", msgError: true}});
        } else {
          res.status(201).json({message: {msgBody: "Account successfully created.", msgError: false}});
        }
      });
    }
  });
});

userRouter.post("/login", passport.authenticate("local", {session: false}), (req, res) => {
  if(req.isAuthenticated()) {
    const { _id, username } = req.user;
    const token = signToken(_id);
    res.cookie("access_token", token, {httpOnly: true, sameSite: true});
    res.status(200).json({isAuthenticated: true, user: {username}});
  }
});

userRouter.get("/logout", passport.authenticate("jwt", {session: false}), (req, res) => {
  res.clearCookie("access_token");
  res.json({user: {username: ""}, success: true});
});

userRouter.get("/authenticated", passport.authenticate("jwt", {session: false}), (req, res) => {
  const { username } = req.user;
  res.status(200).json({isAuthenticated: true, user: {username}});
});

module.exports = userRouter;