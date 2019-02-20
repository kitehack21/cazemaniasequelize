var express = require('express')
var router = express.Router()
const { price } = require('../controllers');
const { auth } = require('../helpers')


router.get('/', (req, res) => res.status(200).send({
    message: "/price path"
}))

router.get('/all', price.getPrice)


module.exports = router;