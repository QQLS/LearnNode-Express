const router = require('express').Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET /signout 登出
router.get('/', checkLogin, function (rq, rs, next) {
    // 清空 session 中的用户信息
    rq.session.user = null
    rq.flash('success', '退出成功')
    rs.redirect('/posts')
})

module.exports = router
