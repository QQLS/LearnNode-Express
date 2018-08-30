const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const mongolass = new Mongolass()

mongolass.connect(config.mongodb)

mongolass.plugin('addCreateAt', {
    afterFind: (results) => {
        results.map((item) => {
            item.create_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
        })
        return results
    },
    afterFindOne: (result) => {
        if (result) {
            result.create_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
        }
        return result
    }
})

exports.User = mongolass.model('User', {
    name: {
        type: 'string',
        required: true
    },
    password: {
        type: 'string',
        required: true
    },
    avatar: {
        type: 'string',
        required: true
    },
    gender: {
        type: 'string',
        enum: ['m', 'f', 'x'],
        default: 'x'
    },
    desc: {
        type: 'string',
        required: true
    }
})
// 根据用户名找到用户，用户名全局唯一
exports.User.index({
    name: 1
}, {
    unique: true
}).exec()

exports.Post = mongolass.model('Post', {
    author: {
        type: Mongolass.Types.ObjectId,
        required: true
    },
    title: {
        type: 'string',
        required: true
    },
    content: {
        type: 'string',
        required: true
    },
    pv: {
        type: 'number',
        default: 0
    }
})
// 按创建时间降序查看用户的文章列表
exports.Post.index({
    author: 1,
    _id: -1
}).exec()

exports.Comment = mongolass.model('Comment', {
    author: {
        type: Mongolass.Types.ObjectId,
        required: true
    },
    content: {
        type: 'string',
        required: true
    },
    postId: {
        type: Mongolass.Types.ObjectId,
        required: true
    }
})

// 通过文章 id 获取该文章下所有留言，按留言创建时间升序
exports.Comment.index({
    postId: 1,
    _id: 1
}).exec()
