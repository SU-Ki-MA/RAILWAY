//ExamInfos test Schema
const mongoose = require("./Main.js")
var Schema = mongoose.Schema;
var userinfos = new Schema({
  userName: String,
  mail: String,
  password: String,
  OTP: Number,
  tickets: Array,
  verified: Boolean
});
var UserInfo = mongoose.model("UserInfo", userinfos);
module.exports = UserInfo