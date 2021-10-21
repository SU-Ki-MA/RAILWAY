const express = require("express")
const jwt = require("jsonwebtoken")
require("dotenv").config();
var app = express.Router();
const UserInfo = require("../mongodb/User.js");
const uuid = require("uuid")
var newUsers = {}

app.route("/sign-up")
  .post((req, res) => {
    console.log(uuid.v4())
  })
module.exports = app