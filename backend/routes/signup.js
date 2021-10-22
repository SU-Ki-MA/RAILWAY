const express = require("express")
const jwt = require("jsonwebtoken")
require("dotenv").config();
var app = express.Router();
const UserInfo = require("../mongodb/User.js");
const uuid = require("uuid");
const Password = require("../functions/Password.js");
const sendMail = require("../functions/mailer");

app.route("/sign-up")
  .post(async (req, res) => {
    try {
      if (!(req.body.password.localeCompare(req.body.confirmPassword))) {
        res.send({ error: "Password and Confirm password doesn't match" })
        return
      }
      var foundMail = await UserInfo.findOne({ mail: req.body.email }).exec()
      if (foundMail) {
        res.send({ error: "The mail id provided is already in use." })
        return
      }
      var hashedPassword = new Password().hash(req.body.password)
      var verificatinNumber = "";
      for (var i = 0; i < n; i++) {
        verificatinNumber += Math.floor(Math.random() * 10)
      }
      if (await sendMail(req.body.email, "Railway OTP", "<h4>Hi " + req.body.userName + ", Thanks for signing up with Railway,Your verification number is " + verificatinNumber + "<h4>")) {
        var create = new UserInfo({
          userName: req.body.userName,
          mail: req.body.email,
          password: hashedPassword,
          OTP: verificatinNumber,
          tickets: [],
          verified: false
        })
        create
          .save()
          .then(() => {
            res.send({ success: true })
          })
          .catch(err => {
            res.send({ error: "Database error..." })
          })
      } else {
        res.send({ error: "Unable to send the verification code." })
      }
    } catch (err) {
      res.send({ error: "server error" })
    }
  })
module.exports = app