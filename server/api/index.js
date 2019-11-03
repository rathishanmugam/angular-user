const express = require('express')
const router = express.Router()

require('./routes/author')(router)
 require('./routes/article')(router)
require('./routes/user')(router)

module.exports = router
