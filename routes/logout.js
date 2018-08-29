const router = require('express').Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET /signout 登出
router.get('/', checkLogin, function (rq, rs, next) {
    rs.send('登出')
})

module.exports = router
