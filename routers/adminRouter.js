var express = require('express')
var router = express.Router()
const { user, bank, catalogue, brand, transaction, phonemodel, price, reseller } = require('../controllers');
const { auth } = require('../helpers')


router.get('/', (req, res) => res.status(200).send({
    message: "/admin path"
}))

router.get('/catalogue', catalogue.adminGetCatalogue)
router.get('/premium', catalogue.adminGetPremium)

router.get('/premiumdetails/:id', catalogue.adminGetPremiumDetails)
router.get('/iphonemodels', brand.getIphones)
router.get('/transactions',  transaction.adminGetAllTransactions)
router.get('/resellers', reseller.getAll)

router.post('/addcatalogue', catalogue.addCatalogue)
router.post('/addpremiumgroup', catalogue.addPremiumGroup)
router.post('/addpremiumcatalogue/:id', catalogue.addPremiumCatalogue)
router.post('/addpremiumimage/:id', catalogue.addPremiumImage)
router.post('/addphonemodel/:id', phonemodel.addPhoneModel)

router.post('/register', user.createAdmin)
router.post('/login', user.adminLogin)
router.get('/keeplogin', auth, user.adminKeepLogin)

router.put('/price/:id', price.editPrice)
router.put('/bank/:id', bank.editBank)
router.put('/catalogue/:id', catalogue.editCatalogue)
router.put('/phonemodel/:id', phonemodel.editPhoneModel)
router.put('/premiumimage/:id', catalogue.editPremiumImage)
router.put('/premiumstock/:id', catalogue.editPremiumStock)
router.put('/premiumgroup/:id', catalogue.editPremiumGroup)

router.put('/addresi/:id', transaction.adminAddResi)
router.put('/confirmpayment/:id', transaction.confirmProof)
router.put('/reseller/:id', reseller.adminAccept)
router.put('/rejectreseller/:id', reseller.adminReject)


module.exports = router;