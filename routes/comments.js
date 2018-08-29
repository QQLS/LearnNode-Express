const router = require('express').Router()

const checkLogin = require('../middlewares/check').checkLogin

// POST /comments 创建一条留言
router.post('/', checkLogin, (rq, rs, next) => {
    rs.send('创建留言')
})

// GET /comments/:commentId/remove 删除一条留言
router.get('/:commentId/remove', checkLogin, function (rq, rs, next) {
    rs.send('删除留言')
})

module.exports = router
