const express = require("express") 
require("dotenv").config();
const app = express.Router(); 
const StationsInfo=require("../mongodb/StationsInfo")
app.route("/station-autocomplete")
  .post(async (req, res) => {
    try {   
      console.log(req.body.regex)
      var stations =await StationsInfo.find({
        "station_name": {
          $regex:req.body.regex ,$options:"i"
        }
      },{
        station_code:1,
        station_name:1
      }).exec().catch(err=>{res.send({error:"Database error."})})
      console.log(stations)
      var out=[...stations] 
      res.send({stations:out}) 
    } catch (err) {  
      console.log(err)
      res.send({ error: "server error" })
    }
  }) 
module.exports = app