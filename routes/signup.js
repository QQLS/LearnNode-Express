const fs = require('fs')
const path = require('path')
const sha1 = require('sha1')
const router = require('express').Router()

const User = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signup 注册页
router.get('/', checkNotLogin, (rq, rs, next) => {
    rs.render('signup')
})

// POST /signup 用户注册
router.post('/', checkNotLogin, (rq, rs, next) => {
    const name = rq.fields.name
    const gender = rq.fields.gender
    const desc = rq.fields.desc
    const avatar = rq.files.avatar.path.split(path.sep).pop()
    let pwd = rq.fields.password
    const repwd = rq.fields.repassword

    // 校验
    try {
        if (name.length <= 0 || name.length > 10) {
            throw new Error('名字应为1 - 10个字符')
        }
        if (!(['m', 'f', 'x'].includes(gender))) {
            throw new Error('姓名只能是 m, f 或 x')
        }
        if (name.length <= 0 || name.length > 30) {
            throw new Error('个人简介请限制在 1 - 30 个字符')
        }
        if (!rq.files.avatar.name) {
            throw new Error('请上传头像')
        }
        if (pwd.length < 6) {
            throw new Error('密码至少 6 个字符')
        }
        if (pwd !== repwd) {
            throw new Error('两次输入密码不一致')
        }
    } catch (error) {
        // 注册失败, 异步删除上传的头像
        fs.unlink(rq.files.avatar.path, (e) => {})
        rq.flash('error', error.message)
        return rs.redirect('/signup')
    }

    // 密码加密
    pwd = sha1(pwd)

    // 构建 Model
    let user = {
        name: name,
        gender: gender,
        desc: desc,
        avatar: avatar,
        password: pwd
    }
    // 写入用户信息
    User.create(user).then((result) => {
        // 此 user 是插入 mongodb 后的值，包含 _id
        user = result.ops[0]
        // 删除密码信息, 将用户信息存入 session
        delete user.password
        rq.session.user = user
        // 写入 flash
        rq.flash('success', '注册成功')
        // 跳到首页
        rs.redirect('/posts')
    }).catch((e) => {
        // 注册失败, 异步删除上传的头像
        fs.unlink(rq.files.avatar.path, (e) => {})
        // 用户名被占用则跳回注册页，而不是错误页
        if (e.message.match('duplicate key')) {
            rq.flash('error', '用户名已被占用')
            return rs.redirect('/signup')
        }
        next(e)
    })
})

module.exports = router
