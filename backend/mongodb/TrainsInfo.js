//ExamInfos test Schema
const mongoose = require("./Main.js")
var Schema = mongoose.Schema;
var trainsinfos = new Schema({ 
  train_name:String,
  train_number:String,
  from_station_name:String,
  from_station_code:String,
  departure:String,
  to_station_name:String,
  to_station_code:String,
  arrival:String,
  distance:Number,
  return_number:String,
  duration_h:Number,
  duration_m:Number,
  train_coordinates:Array
});
var TrainsInfo = mongoose.model("TrainsInfo", trainsinfos);
module.exports = TrainsInfo