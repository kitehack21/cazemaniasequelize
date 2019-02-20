var express = require('express')
var router = express.Router()
const { brand } = require('../controllers');
const { auth } = require('../helpers')


router.get('/', (req, res) => res.status(200).send({
    message: "/brand path"
}))

router.get('/all', brand.getBrands)


module.exports = router;