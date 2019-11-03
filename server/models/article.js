const mongoose = require('mongoose')
const Schema = mongoose.Schema

let articleSchema = new Schema({
        id: {type: String, required: true},
        title: {type: String, required: true},
        date: {type: Date, default: Date.now},
        authorId: {type: String, required: true},
        body: {type: String, required: true}
    },
    {
        collection: 'article'
    })

const article = mongoose.model('Article', articleSchema)

module.exports = article
// userId: mongoose.SchemaTypes.ObjectId,
