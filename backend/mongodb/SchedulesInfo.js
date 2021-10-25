//ExamInfos test Schema
const mongoose = require("./Main.js")
var Schema = mongoose.Schema;
var schedulesinfos = new Schema({ 
  day:Number,
  arrival:String,
  train_name:String,
  station_name:String,
  station_code:String,
  train_number:String, 
  departure:String
});
var SchedulesInfo = mongoose.model("SchedulesInfo", schedulesinfos);
module.exports = SchedulesInfo