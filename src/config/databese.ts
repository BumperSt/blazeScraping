const mongoose = require('mongoose')

export default () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGO_CONNECTION_URL,      {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
      (err:any) => {
        if (err) {
          console.error(err)
          reject(err)
        }
        else {
          console.info("Mongo connected")
          resolve(true)
        }
      })
  })
}