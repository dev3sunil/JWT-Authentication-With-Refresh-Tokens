const mongoose = require('mongoose')
mongoose.Promise = global.Promise;

const DBconnection = async () => {
  const conn = await mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true
    })
    .catch(err => {
      console.log(`For some reasons we couldn't connect to the DB`.red, err)
    })

  console.log("MongoDB Connected successfully..")
}

module.exports = DBconnection