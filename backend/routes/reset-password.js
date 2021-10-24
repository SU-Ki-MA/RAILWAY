const express = require("express")
const jwt = require("jsonwebtoken")
require("dotenv").config();
var app = express.Router();
const UserInfo = require("../mongodb/User.js");  
const sendMail=require("../functions/mailer")
const Password=require("../functions/Password")
app.route("/reset-password")
  .get(async (req, res) => {
    try {   
      var found=await UserInfo.findOne({mail:req.query.mail},{_id:1,userName:1}).exec()
      if(!found){
        res.send({error:"Invalid Email"})
        return
      }
      var verificatinNumber = "";
      for (var i = 0; i < 6; i++) {
        verificatinNumber += Math.floor(Math.random() * 10)
      }
      const mailContext=
      `<center>
          <div>
              <img width="100" height="100" src="https://cdn.discordapp.com/attachments/874868528501620756/901436074675539988/logo_png.png" alt="Railway"/>
          </div>
          <h2><b>Hi <span>${found.userName}</span>,</b></h2> 
          Your OTP for resetting password is:<h1 style="color:#30E3CA;">${verificatinNumber}</h1>
          This OTP is valid only for 3 mins. <br/> 
          (NOTE : Please DO NOT disclose this OTP to anyone.)
        </center>`
      if (await sendMail(req.query.mail, "Railway password reset OTP",mailContext))
      {
        await UserInfo.findOneAndUpdate({_id:found._id},{$set:{OTP:verificatinNumber}}).exec()
        .then(()=>{
          setTimeout(async ()=>{
            found=await UserInfo.findOne({_id:found._id},{otp:1}).exec()
            if(!(found.otp!=null)){ 
              await UserInfo.findOneAndUpdate({_id:found._id},{$set:{OTP:null}}).exec()
              .catch(()=>{
                console.log("OTP is not resetted for the user id - "+found._id)
              })
            }  
          },(1000*60*3)+5000)
          res.send({success:true,_id:found._id})
        }) 
        .catch(err=>{
          console.log(err)
          res.send({error:"Database error try again after 5 minutes.If the Otp is received try again later."})
        })
      } else {
        res.send({ error: "Unable to send the verification code." })
      } 
    } catch (err) { 
      console.log(err)
      res.send({ error: "server error" })
    }
  }) 
  .post(async(req,res)=>{
    var found=await UserInfo.findOne({_id:req.body._id},{mail:1,OTP:1}).exec()
    if(found){
      if(req.body.email===found.mail){
        if(found.OTP==null){
          res.send({error:"No OTP request is available for the user."})
          return 
        }else{
          if(Number(found.OTP)!==Number(req.body.otp)){
            res.send({error:"Invalid OTP."})
            return
          }
          if(req.body.newPassword.length<8){ 
            res.send({ error: "The password should be minimum of 8 characters." })
            return;
          }
          if (req.body.newPassword.localeCompare(req.body.confirmNewPassword)!==0) {
            res.send({ error: "Password and Confirm password doesn't match" })
            return
          } 
          var hashedPassword = new Password().hash(req.body.newPassword)
          await UserInfo.findOneAndUpdate({_id:found._id},{$set:{OTP:null,password:hashedPassword}}).exec()
          .then(()=>{
            res.send({success:true})
          })
          .catch(err=>{
            console.log(err)
            res.send({error:"Database error.Try again after sometime"})            
          })
        }
      }else{ 
        res.send({error:"Id and Email doesn't match."})
      }
    }else{
      res.send({error:"Invalid email"})
    } 
  })
module.exports = app