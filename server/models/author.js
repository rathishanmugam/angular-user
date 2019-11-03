const mongoose = require('mongoose')
const Schema = mongoose.Schema

let authorSchema = new Schema({
        id: {type: String, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        website: {type: String, required: true},
    },
    {
        collection: 'author'
    })
const Author = mongoose.model('Author', authorSchema)

module.exports = Author
