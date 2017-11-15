const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BabyphoneSchema = new Schema({
  serial: {
    type: String,
    required: true,
    unique: true
  }
})

module.exports = mongoose.model('Babyphone', BabyphoneSchema)
