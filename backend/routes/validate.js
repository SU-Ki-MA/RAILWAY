const express = require("express")
require("dotenv").config()
var app = express.Router();
const UserInfo = require("../mongodb/User.js");
const checkDb = require("../functions/checkDb.js")
app.route("/validate")
  .post(checkDb, async (req, res) => {
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