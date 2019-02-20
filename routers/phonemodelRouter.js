var express = require('express')
var router = express.Router()
const { phonemodel } = require('../controllers');
const { auth } = require('../helpers')


router.get('/', (req, res) => res.status(200).send({
    message: "/phone model path"
}))

router.get('/all', phonemodel.getPhoneModels)


module.exports = router;