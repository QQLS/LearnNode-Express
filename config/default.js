module.exports = {
    port: 3000,
    session: {
        key: 'LearnNode-Express', // cookie 中保存 session id 的字段名称
        secret: 'LearnNode-Express', // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
        maxAge: 2592000000 // 失效时间
    },
    mongodb: 'mongodb://localhost:27017/LearnNode-Express'
}
