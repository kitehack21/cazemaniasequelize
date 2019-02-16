var express = require('express')
var router = express.Router()
const { user, testimony } = require('../controllers');
const { auth } = require('../helpers')


router.get('/', (req, res) => res.status(200).send({
    message: "/testimony path"
}))

router.get('/all', testimony.getTestimonies)


module.exports = router;