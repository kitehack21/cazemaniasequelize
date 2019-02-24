var express = require('express')
var router = express.Router()
const { user, catalogue, brand, transaction, phonemodel } = require('../controllers');
const { auth } = require('../helpers')


router.get('/', (req, res) => res.status(200).send({
    message: "/admin path"
}))

router.get('/catalogue', catalogue.adminGetCatalogue)
router.get('/premium', catalogue.adminGetPremium)

router.get('/premiumdetails/:id', catalogue.adminGetPremiumDetails)
router.get('/iphonemodels', brand.getIphones)

router.post('/addcatalogue', catalogue.addCatalogue)
router.post('/addpremiumgroup', catalogue.addPremiumGroup)
router.post('/addpremiumcatalogue/:id', catalogue.addPremiumCatalogue)
router.post('/addpremiumimage/:id', catalogue.addPremiumImage)

router.put('/catalogue/:id', catalogue.editCatalogue)

module.exports = router;