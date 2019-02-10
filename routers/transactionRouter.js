var express = require('express')
var router = express.Router()
const { user, transaction, cart } = require('../controllers');
const { auth } = require('../helpers')


router.get('/', (req, res) => res.status(200).send({
    message: "/transaction path"
}))

router.get('/getcart', auth, cart.getUserCart)


router.post('/purchase', auth, transaction.createTransaction)
router.put('/addtocart', auth, cart.addToCart)
router.delete('/clearcart', auth, cart.clearUserCart)

module.exports = router;