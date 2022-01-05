const mongoose = require('mongoose')

const User = mongoose.model('User', new mongoose.Schema({
    chatId: 'string',
    name: 'string',
    gender: 'string',
    phone: 'string',
    email: 'string',
    address: 'string'
}))

mongoose.connect(process.env.mongoURL, (err) => {
    if (err) {
        console.log("error");
    }
    else {
        console.log("connected");
    }
})

module.exports = {
    User
}