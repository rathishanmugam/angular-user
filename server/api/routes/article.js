const article = require('../../models/article')
const mongoose = require('mongoose')

// Get all article from database
module.exports = function (router) {
    router.get('/article', function (req, res) {
        article.find().exec()
            .then(docs => res.status(200)
                .json(docs))
            .catch(err => res.status(500)
                .json({
                    message: 'Error finding article',
                    error: err
                }))
    })

    // get specific article from database
    router.get('/article/:id', function (req, res) {
        console.log(req.params.id)
        article.findById(req.params.id).exec()
            .then(docs => res.status(200)
                .json(docs))
            .catch(err => res.status(500)
                .json({
                    message: 'Error finding article',
                    error: err
                }))
    })

    // Create new article document...
    router.post('/article', function (req, res) {
        let Article = new article(req.body)
        console.log('article body included:' , req.body)

        Article.save(function (err, Article) {
            if (err) return console.log(err)
            res.status(200).json(Article)
        })
    })
    // Update article document...
    router.put('/article/:_id', function (req, res) {
        console.log('the updating full record is ' , req.body)
        let qry = {_id: req.params._id}
        let doc = {
            id:req.body.id,
            title: req.body.title,
            authorId: req.body.authorId,
            body: req.body.body,
            date:req.body.date
        }
        console.log('the here iam updating record is :', doc)
        article.updateOne(qry, doc, function (err, respRaw) {
            if (err) return console.log(err)
            res.status(200).json(respRaw)
        })
    })

    // delete article from database
    router.delete('/article/:_id', function (req, res) {
        console.log('iam in delete command', req.body)
        let qry = {_id: req.params._id}
        article.remove(qry, function (err, respRaw) {
            if (err) return console.log(err)
            res.status(200).json(respRaw)
        })
    })
}
