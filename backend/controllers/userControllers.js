const express = require("express");
const User = require("../models/User");

 const LoginUser=async function (req, res) {
  try {
    const result = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    if (result) {
      res.send(result);
    } else {
      res.status(500).json("Error");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const RegisterUser=async function (req, res) {
    try {
      const newuser = new User(req.body);
      await newuser.save();
      res.send('User Registered Successfully')
    } catch (error) {
      res.status(500).json(error);
    }
  };
module.exports={LoginUser,RegisterUser};