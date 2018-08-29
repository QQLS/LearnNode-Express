const User = require('../lib/mongo').User

module.exports = {
    create: (user) => User.create(user).exec()
}
