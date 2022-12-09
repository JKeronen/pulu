const mongoose = require('mongoose')
require('dotenv').config();

const url = process.env.MONGODB_URI


mongoose.set('strictQuery', false);
// mongoose 7 aiheutta ilmoituksen, jos tätä asetusta ei tee


console.log('connecting to', url)
mongoose.connect(url, {serverSelectionTimeoutMS: 1000 * 60})
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  // datan validointiasetukset  
  name: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
//console.log(personSchema)

module.exports = mongoose.model('Person', personSchema)