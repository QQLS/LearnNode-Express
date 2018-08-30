const User = require('../lib/mongo').User

module.exports = {
    create: (user) => User.create(user).exec(),
    byName: (name) => User.findOne({ name: name }).addCreateAt().exec()
}
