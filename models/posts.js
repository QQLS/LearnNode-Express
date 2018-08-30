const marked = require('marked')
const Post = require('../lib/mongo').Post
const Comment = require('../lib/mongo').Comment

// 添加转换内容去 html
Post.plugin('contentToHtml', {
    afterFind: (posts) => {
        posts.map((post) => {
            post.content = marked(post.content)
            return post
        })
        return posts
    },
    afterFindOne: (post) => {
        if (post) {
            post.content = marked(post.content)
        }
        return post
    }
})

// 添加获取留言个数
Post.plugin('addCommentCount', {
    afterFind: (posts) => Promise.all(posts.map((post) => {
        return Comment.count(post._id).then((count) => {
            post.commentCount = count
            return post
        })
    })),
    afterFindOne: (post) => {
        if (post) {
            return Comment.count(post._id).then((count) => {
                post.commentCount = count
                return post
            })
        }
        return post
    }
})

module.exports = {
    // 创建文章
    create: (post) => Post.create(post).exec(),
    // 通过 id 获取文章
    byId: (id) => Post.findOne({
        _id: id
    }).populate({
        path: 'author',
        model: 'User'
    }).addCreateAt().contentToHtml().addCommentCount().exec(),
    // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
    posts: (author) => {
        const query = {}
        if (author) {
            query.author = author
        }
        return Post.find(query).populate({
            path: 'author',
            model: 'User'
        }).sort({
            _id: -1
        }).addCreateAt().contentToHtml().addCommentCount().exec()
    },
    // pv + 1
    addPv: (id) => Post.update({
        _id: id
    }, {
        $inc: {
            pv: 1
        }
    }).exec(),
    // 通过文章 id 获取一篇原生文章（编辑文章）
    rawById: (id) => Post.findOne({
        _id: id
    }).populate({
        path: 'author',
        model: 'User'
    }).exec(),
    // 通过文章 id 更新一篇文章
    updateById: (id, data) => Post.update({
        _id: id
    }, {
        $set: data
    }).exec(),
    // 通过文章 id 和用户 id 删除一篇文章
    deleteById: (userId, postId) => Post.deleteOne({
        author: userId,
        _id: postId
    }).exec().then((rs) => {
        // 文章删除后，再删除该文章下的所有留言
        if (rs.result.ok && rs.result.n > 0) {
            return Comment.deleteAllByPostId(postId)
        }
    })
}
