var express = require('express')
var router = express.Router()
const { destination } = require('../controllers')

router.get('/', destination.getDestinations)

module.exports = router;