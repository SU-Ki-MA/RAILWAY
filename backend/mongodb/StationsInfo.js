//ExamInfos test Schema
const mongoose = require("./Main.js")
var Schema = mongoose.Schema;
var stationsinfos = new Schema({ 
    station_name:String,
    station_code:String,
    station_coordinates:String 
});
var StationsInfo = mongoose.model("StationsInfo", stationsinfos);
module.exports = StationsInfo