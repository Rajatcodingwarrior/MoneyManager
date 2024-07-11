const express = require("express");
const router = express.Router();
const {LoginUser,RegisterUser}=require("../controllers/userControllers.js");

router.route("/login").post(LoginUser);
router.route("/register").post(RegisterUser);

module.exports=router;