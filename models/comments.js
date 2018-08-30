const marked = require('marked')
const Comment = require('../lib/mongo').Comment

Comment.plugin('contentToHtml', {
    afterFind: (comments) => {
        comments.map((comment) => {
            comment.content = marked(comment.content)
            return comment
        })
        return comments
    },
    afterFindOne: (comment) => {
        if (comment) {
            comment.content = marked(comment.content)
        }
        return comment
    }
})

module.exports = {
    // 创建评论
    create: (comment) => Comment.create(comment).exec(),
    // 通过 id 获取评论
    byId: (id) => Comment.findOne({
        _id: id
    }).exec(),
    // 通过评论 id 删除一个评论
    deleteById: (id) => Comment.deleteOne({
        _id: id
    }).exec(),
    // 通过文章 id 删除其下的所有评论
    deleteAllByPostId: (id) => Comment.deleteMany({
        postId: id
    }).exec(),
    // 通过文章 id 获取该文章下所有留言，按留言创建时间升序
    comments: (id) => {
        return Comment.find({ postId: id }).populate({
            path: 'author',
            model: 'User'
        }).sort({
            _id: 1
        }).addCreateAt().contentToHtml().exec()
    },
    // 通过文章 id 获取该文章下留言数
    count: (id) => Comment.count({ postId: id }).exec()
}
