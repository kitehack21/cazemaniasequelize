var express = require('express')
var router = express.Router()
const { linktree } = require('../controllers');
const { auth } = require('../helpers')


router.get('/', (req, res) => res.status(200).send({
    message: "/link tree path"
}))

router.get('/links', linktree.getLinks)

module.exports = router;