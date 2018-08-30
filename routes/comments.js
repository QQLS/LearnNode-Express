const router = require('express').Router()

const Comment = require('../models/comments')
const checkLogin = require('../middlewares/check').checkLogin

// POST /comments 创建一条留言
router.post('/', checkLogin, (rq, rs, next) => {
    const userId = rq.session.user._id
    const postId = rq.fields.postId
    const content = rq.fields.content

    try {
        if (!content.length) {
            throw new Error('内容不能为空')
        }
    } catch (error) {
        rq.flash('error', error.message)
        rs.redirect('back')
    }

    Comment.create({
        author: userId,
        postId: postId,
        content: content
    }).then(() => {
        rq.flash('success', '留言成功')
        rs.redirect('back')
    }).catch(next)
})

// GET /comments/:commentId/remove 删除一条留言
router.get('/:commentId/remove', checkLogin, function (rq, rs, next) {
    const commentId = rq.params.commentId
    const userId = rq.session.user._id

    Comment.byId(commentId).then((comment) => {
        if (!comment) {
            throw new Error('留言不存在')
        }
        if (comment.author.toString() !== userId.toString()) {
            throw new Error('没有权限删除')
        }

        Comment.deleteById(commentId).then(() => {
            rq.flash('success', '删除留言成功')
            rs.redirect('back')
        }).catch(next)
    })
})

module.exports = router
