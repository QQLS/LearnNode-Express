const router = require('express').Router()

const Post = require('../models/posts')
const Comment = require('../models/comments')
const checkLogin = require('../middlewares/check').checkLogin

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', (rq, rs, next) => {
    const author = rq.query.author
    Post.posts(author).then((posts) => {
        rs.render('posts', { posts: posts })
    }).catch(next)
})

// GET /posts/create 发表文章页
router.get('/create', checkLogin, (rq, rs, next) => {
    rs.render('create')
})

// POST /posts/create 发表一篇文章
router.post('/create', checkLogin, (rq, rs, next) => {
    const author = rq.session.user._id
    const title = rq.fields.title
    const content = rq.fields.content

    try {
        if (!title.length) {
            throw new Error('请填写标题')
        }
        if (!content.length) {
            throw new Error('请填写内容')
        }
    } catch (error) {
        rq.flash('error', error.message)
        return rs.redirect('back')
    }

    let post = {
        author: author,
        title: title,
        content: content
    }
    Post.create(post).then((result) => {
        post = result.ops[0]
        rq.flash('success', '发表成功')
        rs.redirect(`/posts/${post._id}`)
    })
})

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', (rq, rs, next) => {
    const id = rq.params.postId

    Promise.all([
        Post.byId(id),
        Comment.comments(id),
        Post.addPv(id)
    ]).then((result) => {
        const post = result[0]
        if (!post) {
            throw new Error('帖子不存在')
        }
        const comments = result[1]
        rs.render('post', { post: post, comments: comments })
    }).catch(next)
})

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, (rq, rs, next) => {
    const id = rq.params.postId
    const userId = rq.session.user._id

    Post.rawById(id).then((post) => {
        if (!post) {
            throw new Error('帖子不存在')
        }
        if (userId.toString() !== post.author._id.toString()) {
            throw new Error('权限不足')
        }
        rs.render('edit', { post: post })
    })
})

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, (rq, rs, next) => {
    const title = rq.fields.title
    const content = rq.fields.content
    const id = rq.params.postId
    const userId = rq.session.user._id

    try {
        if (!title.length) {
            throw new Error('标题不能为空')
        }
        if (!content.length) {
            throw new Error('内容不能为空')
        }
    } catch (error) {
        rq.flash('error', error.message)
        return rs.redirect('back')
    }

    Post.rawById(id).then((post) => {
        if (!post) {
            throw new Error('帖子已不存在')
        }
        if (userId.toString() !== post.author._id.toString()) {
            throw new Error('权限不足')
        }
        Post.updateById(id, { title: title, content: content }).then(() => {
            rq.flash('success', '修改成功')
            rs.redirect(`/posts/${post._id}`)
        })
    })
})

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, (rq, rs, next) => {
    const id = rq.params.postId
    const userId = rq.session.user._id

    Post.rawById(id).then((post) => {
        if (!post) {
            throw new Error('帖子已不存在')
        }
        if (userId.toString() !== post.author._id.toString()) {
            throw new Error('权限不足')
        }
        Post.deleteById(id).then(() => {
            rq.flash('success', '删除文章成功')
            rs.redirect('/posts')
        })
    })
})

module.exports = router
