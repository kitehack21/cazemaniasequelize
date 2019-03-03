var express = require('express')
var router = express.Router()
const { reseller } = require('../controllers');
const { auth } = require('../helpers')


router.get('/', (req, res) => res.status(200).send({
    message: "/reseller model path"
}))

router.post('/request', auth, reseller.registerReseller)

module.exports = router;