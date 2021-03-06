const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
// 这个会默认回去 config 文件夹下面的 default 文件
const config = require('config-lite')(__dirname)
const routes = require('./routes')
const pkg = require('./package.json')

const app = express()

// 设置模板目录
app.set('views', path.join(__dirname, 'views'))
// 设置模板引擎为 ejs
app.set('view engine', 'ejs')

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')))
// 设置 session 中间件
app.use(session({
    name: config.session.key,
    secret: config.session.secret,
    resave: true, // 强制更新 session
    saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
    cookie: {
        maxAge: config.session.maxAge
    },
    store: new MongoStore({ // 将 session 存储到 mongodb
        url: config.mongodb // mongodb 地址
    })
}))

app.use(require('express-formidable')({
    uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
    keepExtensions: true // 保留后缀
}))

// 用来显示通知
app.use(flash())

app.locals.blog = {
    title: pkg.name,
    description: pkg.description
}

app.use((rq, rs, next) => {
    rs.locals.user = rq.session.user
    rs.locals.success = rq.flash('success').toString()
    rs.locals.error = rq.flash('error').toString()
    next()
})

// 设置路由
routes(app)

app.use((err, rq, rs, next) => {
    console.error(err)
    rq.flash('error', err.message)
    rs.redirect('/posts')
})

// 监听端口, 启动程序
app.listen(config.port, () => {
    console.log(`${pkg.name} listening on port ${config.port}`)
})
