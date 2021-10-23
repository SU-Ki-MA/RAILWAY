const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors")
require("dotenv").config()

//config
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json())
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true
}))
//used to make source as static folder
app.use(express.static(__dirname + "/source"))

//Routes

//validate
app.use(require("./routes/validate"));
//sign-up
app.use(require("./routes/signup"));
//verify-signup
app.use(require("./routes/verify-signup"));
//signin
app.use(require("./routes/signin"));
//reset-password
app.use(require("./routes/reset-password"));

//verify-jwt
app.use(require("./routes/verify-jwt"));

//used to run server in port 3001
app.listen(3001, function () {
  console.log("app is running in 3001")
})
