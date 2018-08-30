const sha1 = require('sha1')
const router = require('express').Router()

const User = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /login 登录页
router.get('/', checkNotLogin, function (rq, rs, next) {
    rs.render('login')
})

// POST /login 用户登录
router.post('/', checkNotLogin, function (rq, rs, next) {
    const name = rq.fields.name
    const pwd = rq.fields.password
    try {
        if (!name.length) {
            throw new Error('请输入姓名')
        }
        if (!pwd.length) {
            throw new Error('请输入密码')
        }
    } catch (error) {
        rq.flash('error', error.message)
        return rs.redirect('back')
    }

    User.byName(name).then((user) => {
        if (!user) {
            rq.flash('error', '用户不存在')
            return rs.redirect('back')
        }

        if (sha1(pwd) !== user.password) {
            rq.flash('error', '用户名或密码错误')
            return rs.redirect('back')
        }
        rq.flash('success', '登录成功')
        // 写入 session
        delete user.password
        rq.session.user = user
        // 进入主页
        rs.redirect('/posts')
    }).catch(next)
})

module.exports = router
