const express = require("express") 
require("dotenv").config();
var app = express.Router(); 
const TrainsInfo=require("../mongodb/TrainsInfo")
const StationsInfo=require("../mongodb/StationsInfo")
const SchedulesInfo=require("../mongodb/SchedulesInfo")
app.route("/search-trains")
  .post(async (req, res) => {
    try{
      if(!(req.body.from && req.body.to && req.body.date)){
        res.send({error:"Please enter all the values."})
        return
      } 
      const fromStationCode=req.body.from.split(" - ")[1]
      const toStationCode=req.body.to.split(" - ")[1] 
      const fromCoordinates=await StationsInfo.findOne({station_code:fromStationCode},{_id:0,station_coordinates:1}).exec()
      const toCoordinates=await StationsInfo.findOne({station_code:toStationCode},{_id:0,station_coordinates:1}).exec()
      var trainDetails=await TrainsInfo.find({
        train_coordinates: {
          $all: [fromCoordinates.station_coordinates, toCoordinates.station_coordinates]
        }
      },{
        train_name:1,
        train_number:1,
        train_coordinates:1
      }).exec() 
      trainDetails=removeDuplicated(trainDetails,fromCoordinates.station_coordinates,toCoordinates.station_coordinates) 
      var out=[] 
      for(var i=0;i<trainDetails.length;i++){
        var fromSchedule=await SchedulesInfo.findOne({station_code:fromStationCode,train_number:trainDetails[i].train_number},{station_name:1,departure:1}).exec()
        var toSchedule=await SchedulesInfo.findOne({station_code:toStationCode,train_number:trainDetails[i].train_number},{station_name:1,arrival:1,day:1}).exec()
        var value_start = fromSchedule.departure.split(':');
        var value_end = toSchedule.arrival.split(':'); 
        var duration_h;
        if(toSchedule.day==1){
          duration_h=Number(value_end[0])-Number(value_start[0])
        }else{
          duration_h=(24-Number(value_start[0]))+((toSchedule.day-2)*24)+(Number(value_end[0]))
        }  
        var duration_m;  
        if(Number(value_start[1])>Number(value_end[1])){
          duration_m=Number(value_start[1])-Number(value_end[1])
          duration_h-=1 
        }else{
          duration_m=Number(value_end[1])-Number(value_start[1])
        }  
        duration_h=duration_h<10?"0"+duration_h:String(duration_h)
        duration_m=duration_m<10?"0"+duration_m:String(duration_m)
        out.push({
          ...trainDetails[i]._doc,
          from_station_name:fromSchedule.station_name,
          to_station_name:toSchedule.station_name,
          from_departure:fromSchedule.departure,
          to_arrival:toSchedule.arrival,
          duration:duration_h+":"+duration_m
        }) 
      } 
      res.send({trainsInfo:out})
    }catch(err){
      console.log(err) 
      res.send({error:"Server error."})
    }
  }) 
function removeDuplicated(array,fromCoordinates,toCoordinates){
  return array.filter((value)=>{  
    for(var i=0;i<value.train_coordinates.length;i++){ 
      if(value.train_coordinates[i]==fromCoordinates){ 
        return true
      }
      if(value.train_coordinates[i]==toCoordinates){ 
        return false
      }
    }
  }) 
}
module.exports = app