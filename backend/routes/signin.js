const express = require("express")
const jwt = require("jsonwebtoken")
require("dotenv").config();
var app = express.Router();
const UserInfo = require("../mongodb/User.js"); 
const Password = require("../functions/Password.js"); 

app.route("/sign-in")
  .post(async (req, res) => {
    try { 
      var user=await UserInfo.findOne({mail:req.body.email},{password:1,mail:1,userName:1}).exec()
      var password=new Password()
      if(user){
        if(await password.compare(req.body.password,user.password)){
          var token=await jwt.sign({mail:user.mail,_id:user._id},process.env.JWT_SALT,{ expiresIn: '1h' })
          res.send({token:token,mail:user.mail,userName:user.userName})
        }else{
          res.send({error:"Invalid password."})
        }
      }else{
        res.send({error:"Invalid Mail Id."})
      }
    } catch (err) { 
      console.log(err)
      res.send({ error: "server error" })
    }
  }) 
module.exports = app