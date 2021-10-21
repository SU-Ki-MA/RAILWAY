const express = require("express")
require("dotenv").config()
var app = express.Router();
const UserInfo = require("../mongodb/User.js");
app.route("/validate")
  .post(async (req, res) => {
    try {
      var findUser = await UserInfo.findOne({ mail: req.body.mail }).exec()
      if (findUser) {
        res.send({ error: "Mail is not avaiable..." })
      } else {
        res.send({ success: true })
      }
    } catch (err) {
      res.send({ error: "Server error..." })
    }
  })
module.exports = app