/* eslint-disable no-unused-vars */
require('dotenv').config()
const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI

console.log('connecting to', url)

const namesSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'your name is too short lmao'],
        required: [true, 'u have no name or what?']
    },
    number: {
        type: String,
        validate: {
            validator: (v) => {
                return /\d\d-\d{7}|\d\d\d-\d{7}/.test(v)
            }
        },
        length: [8, 'too short'],
        required: [true, 'gimme ur number, thans a PHONEBOOK']
    },
})

const Kids = mongoose.model('Kids', namesSchema)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })



namesSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
module.exports = mongoose.model('Person', namesSchema)