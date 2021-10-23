const express = require("express")
const jwt = require("jsonwebtoken")
require("dotenv").config();
var app = express.Router();
const UserInfo = require("../mongodb/User.js");  

app.route("/verify-signup")
  .post(async (req, res) => {
    try {  
      var user=await UserInfo.findOne({_id:req.body._id},{OTP:1,verified:1}).exec();
      if(user){
        if(!(user.verified)){
          if(user.OTP!==null){
            if(Number(req.body.otp)===Number(user.OTP)){
              await UserInfo.findOneAndUpdate({_id:req.body._id},{$set:{OTP:null,verified:true}}).exec()
              .then(()=>{
                res.send({success:true})
              }) 
              .catch(err=>{
                console.log(err)
                res.send({error:"Database error try again after 5 minutes."})
              })
            }else{
              res.send({error:"Invalid otp."})
            }
          }else{
            res.send({error:"Database error try again after 5 minutes."})
          }
        }else{
          res.send({error:"User already verified."})
        }
      }else{
        res.send({error:"User doesn't exist."})
      }
    } catch (err) { 
      console.log(err)
      res.send({ error: "server error" })
    }
  }) 
module.exports = app