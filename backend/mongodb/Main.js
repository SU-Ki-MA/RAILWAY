const mongoose = require("mongoose")
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(err => console.log(err))
module.exports = mongoose
