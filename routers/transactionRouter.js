var express = require('express')
var router = express.Router()
const { user, transaction, cart } = require('../controllers');
const { auth } = require('../helpers')


router.get('/', (req, res) => res.status(200).send({
    message: "/transaction path"
}))


router.put('/addtocart', cart.addToCart)

module.exports = router;