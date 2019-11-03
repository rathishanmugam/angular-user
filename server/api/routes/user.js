const User = require('../../models/user')

module.exports = function (router) {
    // router.get('/user', function (req, res) {
    //     console.log('the request body is:' ,req.body)
    //
    //     User.find().exec()
    //         .then(docs => res.status(200)
    //             .json(docs))
    //         .catch(err => res.status(500)
    //             .json({
    //                 message: 'Error finding author',
    //                 error: err
    //             }))
    // })


    router.get('/user/:id', function (req, res) {
        User.findById(req.params.id).exec()
            .then(docs => res.status(200)
                .json(docs))
            .catch(err => res.status(500)
                .json({
                    message: 'Error finding author',
                    error: err
                }))
    })

    // router.get('/user', (req, res) => {
    //     console.log('iam innnnnn', req.query);
    //     const queryParams = req.query;
    //     const ordering = parseInt(queryParams.order);
    //     var sortParams;
    //     if (queryParams.sort === 'first') {
    //         sortParams = {first: ordering};
    //
    //     } else if (queryParams.sort === 'last') {
    //         sortParams = {last: ordering};
    //
    //     } else if (queryParams.sort === 'location') {
    //         sortParams = {location: ordering};
    //
    //     } else {
    //         sortParams = {hobby: ordering};
    //
    //     }
    //     let sorting = queryParams.sort.trim();
    //     var query = {};
    //     var aggregate = User.aggregate();
    //     const endDt = new Date(Date.UTC(2019, 9, 1))
    //     // aggregate.match({added : { $lt: endDt } })
    //     aggregate.match({added: {'lt': endDt}})
    //         .group({})
    //     const options = {
    //         select: '  first last email phone location hobby ',
    //         sort: sortParams || {first: 1},
    //         page: parseInt(queryParams.page) || 1,
    //         limit: parseInt(queryParams.limit) || 4,
    //         collation: {
    //             'locale': 'en'
    //         }
    //
    //     };
    //     var pageOptions = {
    //         collation: {
    //             'locale': 'en'
    //         },
    //         page: parseInt(queryParams.page) || 1,
    //         limit: parseInt(queryParams.limit) || 5,
    //         sort: sortParams || {first: 1}
    //     }
    //     // User.paginate({}, {collation:pageOptions.collation, page: pageOptions.page, limit: pageOptions.limit,  sort: pageOptions.sort })
    //       User.paginate(query, options)
    //
    //     // User.find()
    //     // // .skip(parseInt(queryParams.page)*parseInt(queryParams.limit))
    //     //     .limit(parseInt(pageOptions.limit))
    //     //     .collation({locale: "en"})
    //     //     .sort(sortParams || {first: 1})
    //     //     .exec()
    //
    //
    //         .then(docs => res.status(200)
    //             .json(docs))
    //         .catch(err => res.status(500)
    //             .json({
    //                 message: 'Error finding User',
    //                 error: err
    //             }))
    // })

    router.get('/user', (req, res) => {
        console.log('iam innnnnn', req.query);
        const queryParams = req.query;
        const ordering = parseInt(queryParams.order);
        const filter = queryParams.filter || '';
        var sortParams;
        if (queryParams.sort === 'first') {
            sortParams = {first: ordering};

        } else if (queryParams.sort === 'last') {
            sortParams = {last: ordering};

        } else if (queryParams.sort === 'location') {
            sortParams = {location: ordering};

        } else {
            sortParams = {hobby: ordering};

        }
        let sorting = queryParams.sort.trim();
        var query = {};
        User.find({
            '$or': [{"last": {$regex: filter, $options: 'i'}}, {
                "first": {
                    $regex: filter,
                    $options: 'i'
                }
            }, {"location": {$regex: filter, $options: 'i'}}, {"hobby": {$regex: filter, $options: 'i'}}]
        })
        // .populate('first')
        // .populate({
        //     path: 'first',
        //     match: { first: { $in: filter }},
        //      select: '_id id first last email phone location hobby added'
        // })
        // .where('first').in(filter)
            .skip(parseInt(queryParams.page) * parseInt(queryParams.limit))
            .limit(parseInt(queryParams.limit))
            .collation({locale: "en"})
            .sort(sortParams || {first: 1})
            .exec()
            .then(docs => {
                User.count({}, function (err, count) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).json({count: count, docs: docs});
                });
            })
            .catch(err => res.status(500)
                .json({
                    message: 'Error finding User',
                    error: err
                }))
    })

    router.post('/user', function (req, res) {
        let user = new User(req.body)
        console.log(req.body)
        user.save(function (err, user) {
            if (err) return console.log(err)
            res.status(200).json(user)
        })
    })

    router.put('/user/:_id', function (req, res) {
        console.log('update record', req.body)
        let qry = {_id: req.params._id}
        let doc = {
            // id: req.body.id,
            first: req.body.first,
            last: req.body.last,
            email: req.body.email,
            phone: req.body.phone,
            location: req.body.location,
            hobby: req.body.hobby,
            added: req.body.added
        }
        console.log(doc)
        User.update(qry, doc, function (err, respRaw) {
            if (err) return console.log(err)
            res.status(200).json(respRaw)
        })
    }),
        // delete user from database
        router.delete('/user/:_id', function (req, res) {
            console.log('iam in delete record', req.body)
            let qry = {_id: req.params._id}
            User.remove(qry, function (err, respRaw) {
                if (err) return console.log(err)
                res.status(200).json(respRaw)
            })
        })

}







