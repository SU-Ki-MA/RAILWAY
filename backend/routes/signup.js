const express = require("express") 
require("dotenv").config();
var app = express.Router();
const UserInfo = require("../mongodb/User.js"); 
const Password = require("../functions/Password.js");
const sendMail = require("../functions/mailer");

app.route("/sign-up")
  .post(async (req, res) => {
    try { 
      if(req.body.password.length<8){ 
        res.send({ error: "The password should be minimum of 8 characters." })
        return;
      }
      if (req.body.password.localeCompare(req.body.confirmPassword)!==0) {
        res.send({ error: "Password and Confirm password doesn't match" })
        return
      } 
      var foundMail = await UserInfo.findOne({ mail: req.body.email }).exec()
      if (foundMail) {
        res.send({ error: "The mail id provided is already in use." })
        return
      }
      var hashedPassword = new Password().hash(req.body.password)
      var verificatinNumber = "";
      for (var i = 0; i < 6; i++) {
        verificatinNumber += Math.floor(Math.random() * 10)
      }
      const mailContext=
      `<center>
          <div>
              <img width="100" height="100" src="https://cdn.discordapp.com/attachments/874868528501620756/901436074675539988/logo_png.png" alt="Railway"/>
          </div>
          <h2><b>Hi <span>${req.body.userName}</span>,</b></h2>
          Thank you for signing up with Railway,<br/>
          your OTP for verification is:<h1 style="color:#30E3CA;">${verificatinNumber}</h1>
          This OTP is valid only for 3 mins. <br/> 
          (NOTE : Please DO NOT disclose this OTP to anyone.)
        </center>`
      if (await sendMail(req.body.email, "Railway Verification OTP",mailContext))
      {
        var create = new UserInfo({
          userName: req.body.userName,
          mail: req.body.email,
          password: hashedPassword,
          OTP: verificatinNumber,
          tickets: [],
          verified: false
        }) 
        create
          .save()
          .then(() => {
            setTimeout(async ()=>{
              var found=await UserInfo.findOne({_id:create._id},{verified:1}).exec()
              if(!(found.verified)){
                await UserInfo.findOneAndDelete({_id:found._id}).exec().catch(err=>{
                  console.log("User is not deleted.User id :"+found._id);
                })
              }  
            },(1000*60*3)+5000)
            res.send({ success: true,_id:create._id })
          })
          .catch(err => {
            res.send({ error: "Database error..." })
          })
      } else {
        res.send({ error: "Unable to send the verification code." })
      }
    } catch (err) { 
      console.log(err)
      res.send({ error: "server error" })
    }
  }) 
module.exports = app