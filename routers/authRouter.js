var express = require('express')
var router = express.Router()
const { user } = require('../controllers');
const { auth } = require('../helpers')


router.get('/', (req, res) => res.status(200).send({
    message: "/auth path"
}))

router.get('/userinfo', auth, user.getUserData)
router.get('/profile', auth, user.getProfile)

router.post('/register', user.register)
router.post('/login', user.login)

router.put('/editprofile', auth, user.editProfile)
router.put('/changepassword', auth, user.changePassword)

module.exports = router;