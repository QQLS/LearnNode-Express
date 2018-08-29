module.exports = (app) => {
    app.get('/', (rq, rs) => {
        rs.redirect('/posts')
    })
    app.use('/signup', require('./signup'))
    app.use('/login', require('./login'))
    app.use('/logout', require('./logout'))
    app.use('/posts', require('./posts'))
    app.use('/comments', require('./comments'))
}
