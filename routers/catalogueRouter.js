var express = require('express')
var router = express.Router()
const { user, catalogue } = require('../controllers');
const { auth } = require('../helpers')


router.get('/', (req, res) => res.status(200).send({
    message: "/catalogue path"
}))

router.get('/getproduct/:id', catalogue.getProduct)
router.get('/bestsellers', catalogue.bestsellers)
router.get('/products', catalogue.getCatalogue)
router.get('/similarproducts/:id', catalogue.getSimilarProducts)

router.get('/premiumstock', catalogue.getPremiumStock)



module.exports = router;