var express = require('express')
var router = express.Router()
const { user, catalogue } = require('../controllers');
const { auth } = require('../helpers')


router.get('/', (req, res) => res.status(200).send({
    message: "/admin path"
}))

router.get('/catalogue', catalogue.adminGetCatalogue)

router.post('/addcatalogue', catalogue.addCatalogue)
router.post('/addpremium', catalogue.addPremiumCatalogue)

module.exports = router;