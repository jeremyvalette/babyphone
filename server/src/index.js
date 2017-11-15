const express     = require('express')
const bodyParser  = require('body-parser')
const app         = express()
const dbConf      = require('./config/db')
const routes      = require('./routes')
const mongoose    = require('mongoose')
mongoose.Promise = Promise
const passport    = require('passport')

const morgan      = require('morgan')

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.use(passport.initialize())

app.use(bodyParser.urlencoded({ extended: true }))

const port = 8000

mongoose.connect(dbConf.url, { useMongoClient: true }).then((db) => {
  routes(app)

  app.listen(port, () => {
    console.log('We are live on ' + port)
  })
}, (err) => {
  console.log(err)
})
