var express = require('express')
var router = express.Router()
const { bank } = require('../controllers');
const { auth } = require('../helpers')


router.get('/', (req, res) => res.status(200).send({
    message: "/bankpath"
}))

router.get('/all', bank.getBanks)


module.exports = router;