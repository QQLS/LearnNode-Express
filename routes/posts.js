const router = require('express').Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', (rq, rs, next) => {
    rs.send('首页')
})

// POST /posts/create 发表一篇文章
router.post('/create', checkLogin, (rq, rs, next) => {
    rs.send('发表文章')
})

// GET /posts/create 发表文章页
router.get('/create', checkLogin, (rq, rs, next) => {
    rs.send('发表文章页')
})

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', (rq, rs, next) => {
    rs.send('文章详情页')
})

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, (rq, rs, next) => {
    rs.send('更新文章页')
})

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, (rq, rs, next) => {
    rs.send('更新文章')
})

// POGT /posts/:postId/remove 删除一篇文章
router.post('/:postId/remove', checkLogin, (rq, rs, next) => {
    rs.send('删除文章')
})

module.exports = router
