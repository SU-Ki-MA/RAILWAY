const nodemailer = require("nodemailer")
//nodemailer 
async function sendMail(toMail, subject, html) {
  let nodemailer = require('nodemailer')
  let transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    secure: false,
    port: 587,
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASSWORD
    }
  })
  var sent = await transporter.sendMail({
    from: process.env.MAIL, // sender address
    to: toMail, // list of receivers
    subject: subject, // Subject line 
    html: html, // html body
  }).catch(err => {
    sent = false
  })
  if (sent) {
    if (sent.messageId) {
      return (true)
    } else {
      return (false)
    }
  } else {
    return (false)
  }
}
module.exports = sendMail
