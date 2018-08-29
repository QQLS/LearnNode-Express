const router = require('express').Router()

const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signup 注册页
router.get('/', checkNotLogin, (rq, rs, next) => {
    rs.send('注册页')
})

// POST /signup 用户注册
router.post('/', checkNotLogin, function (rq, rs, next) {
    rs.send('注册')
})

module.exports = router
