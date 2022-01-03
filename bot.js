require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(process.env.token, { polling: true })
bot.on('polling_error', console.log)

const steps = {
    START: 0, NAME: 1, GENDER: 2, BIRTHDAY: 3, PHONE: 4, EMAIL: 5, ADDRESS: 6, COMPLETE: 7
}

function createUser(id) {
    return {
        id: id,
        name: "",
        gender: "",
        birthday: "",
        phone: "",
        email: "",
        address: "",
        step: steps.START
    }
}

const users = {}
// id : user

bot.on('message', (msg) => {

    let user = findUser(msg)

    if (msg.text === '/start') {
        onStart(msg)
    }
    else if (user) {
        if (user.step === steps.NAME) {
            onName(msg)
        }
    }
    else {
        bot.sendMessage(msg.chat.id, '/start bosing!')
    }
})

bot.on("callback_query", (query) => {
    bot.sendMessage(msg.chat.id, '!! Uzur, bot toligligicha ishlamaydi!')
})

bot.on("contact", (msg, metadata) => {
    bot.sendMessage(msg.chat.id, '!!Uzur, bot toligligicha ishlamaydi!')
})

function onStart(msg) {
    let user = authorizeUser(msg)
    requireName(user, msg)
}

function onName(msg) {
    let user = findUser(msg)
    user.name = msg.text

    requireGender(user, msg)
}

function requireName(user, msg) {
    bot.sendMessage(msg.chat.id, "Ismingizni kiriting")
    user.step = steps.NAME
}

function requireGender(user, msg) {
    let genders = {
        inline_keyboard : [
            [ {text: "Male", callback_data: "male"}, {text: "Female", callback_data: "female"} ]
        ]
    }
    bot.sendMessage(msg.chat.id, "Genderni tanlang:", { reply_markup: genders })
    user.step = steps.GENDER
}

function findUser(msg) {
    return users[msg.chat.id]
}

function authorizeUser(msg) {
    const user = createUser(msg.chat.id)
    users[msg.chat.id] = user

    return user
}