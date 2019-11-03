const Author = require('../../models/author')

module.exports = function (router) {
  router.get('/author', function (req, res) {
      console.log('the request body is:' ,req.body)

      Author.find().exec()
        .then(docs => res.status(200)
            .json(docs))
        .catch(err => res.status(500)
            .json({
              message: 'Error finding author',
              error: err
            }))
  })


  router.get('/author/:id', function (req, res) {
      Author.findById(req.params.id).exec()
      .then(docs => res.status(200)
        .json(docs))
      .catch(err => res.status(500)
        .json({
          message: 'Error finding author',
          error: err
        }))
  })

  router.post('/author', function (req, res) {
    let user = new Author(req.body)
      console.log(req.body)
      user.save(function (err, user) {
      if (err) return console.log(err)
      res.status(200).json(user)
    })
  })

  router.put('/author/:_id', function (req, res) {
    console.log('update record', req.body)
    let qry = { _id: req.params._id }
    let doc = {
        id: req.body.id,
        firstName: req.body.firstName,
      lastName: req.body.lastName,
      website: req.body.website
    }
    console.log(doc)
      Author.update(qry, doc, function (err, respRaw) {
      if (err) return console.log(err)
      res.status(200).json(respRaw)
    })
  }),
      // delete user from database
      router.delete('/author/:_id', function (req, res) {
          console.log('iam in delete record' ,req.body)
          let qry = {_id: req.params._id}
          Author.remove(qry, function (err, respRaw) {
              if (err) return console.log(err)
              res.status(200).json(respRaw)
          })
      })

}







