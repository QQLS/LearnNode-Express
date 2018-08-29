module.exports = {
    checkLogin: (rq, rs, next) => {
        if (!rq.session.user) {
            rq.flash('error', '未登录')
            return rs.redirect('/login')
        }
        next()
    },
    checkNotLogin: (rq, rs, next) => {
        if (rq.session.user) {
            rq.flash('error', '已经登录')
            return rs.redirect('back')
        }
        next()
    }
}
