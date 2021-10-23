const express = require("express")
const jwt = require("jsonwebtoken")
require("dotenv").config();
var app = express.Router();
const UserInfo = require("../mongodb/User.js"); 

app.route("/verify-jwt")
  .post(async (req, res) => {
    try {   
      var values=jwt.verify(req.body.token,process.env.JWT_SALT)
      if(values){
        var user=await UserInfo.findOne({mail:req.body.mail},{_id:1,userName:1}).exec() 
        if(user._id==values._id && user.userName==req.body.userName){
          res.send({success:true})
        }else{
          res.send({error:"Invalid jwt"})
        }
      }else{
        res.send({error:"Invalid jwt"})
      }
    } catch (err) { 
      console.log(err)
      res.send({ error: "server error" })
    }
  }) 
module.exports = app