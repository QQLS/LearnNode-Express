const router = require('express').Router()

const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /login 登录页
router.get('/', checkNotLogin, function (rq, rs, next) {
    rs.send('登录页')
})

// POST /login 用户登录
router.post('/', checkNotLogin, function (rq, rs, next) {
    rs.send('登录')
})

module.exports = router
