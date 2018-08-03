module.exports = {
  port: 3000,
  session: {
    secret: 'LearnNode-Express',
    key: 'LearnNode-Express',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/LearnNode-Express'
}
