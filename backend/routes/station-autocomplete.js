const express = require("express") 
require("dotenv").config();
const app = express.Router(); 
const StationsInfo=require("../mongodb/StationsInfo")
app.route("/station-autocomplete")
  .post(async (req, res) => {
    try {    
      var stationsByName = await StationsInfo.find({
        "station_name": {
          $regex:req.body.regex ,$options:"i"
        }
      },{
        station_code:1,
        station_name:1
      }).limit(25).sort({'station_name': 1}).exec()
      var stationByCode=await StationsInfo.find({
        "station_code": {
          $regex:req.body.regex ,$options:"i"
        }
      },{
        station_code:1,
        station_name:1
      }).limit(25).sort({'station_code': 1}).exec()
      if(stationByCode && stationsByName){
        res.send({stations:removeDuplicated([...stationByCode,...stationsByName])}) 
      }else if(stationByCode){
        res.send({stations:stationByCode})
      }else if(stationsByName){
        res.send({stations:stationsByName})
      }
    } catch (err) {   
      res.send({ error: "server error" })
    }
  }) 
function removeDuplicated(array){
  return array.filter((value,index,array)=>{
    var valueIndex=-1
    for(let i=0;i<=index;i++){    
      if(value._id.valueOf()==array[i]._id.valueOf()){
        valueIndex=i
        break
      }
    }
    return (valueIndex==index)
  }) 
}
module.exports = app