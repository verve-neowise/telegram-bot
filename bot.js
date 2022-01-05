require('dotenv').config()

const { User } = require('./db')

const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(process.env.token, { polling: true })
bot.on('polling_error', console.log)

const steps = {
    START: 0, NAME: 1, GENDER: 2, PHONE: 4, EMAIL: 5, ADDRESS: 6, COMPLETE: 7
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
// any text
bot.on('message', (msg) => {

    let user = findUser(msg)

    if (msg.text === '/start') {
        onStart(msg)
    }
    else if (user) {
        if (user.step === steps.NAME) {
            onName(msg)
        }
        else if (user.step === steps.EMAIL) {
            onEmail(msg)
        }
        else if (user.step === steps.ADDRESS) {
            onAddress(msg)
        }
    }
    else {
        bot.sendMessage(msg.chat.id, '/start bosing!')
    }
})
// knopkalar
bot.on("callback_query", (query) => {
    let user = findUser(query.message)

    if (user) {
        if (user.step === steps.GENDER) {
            onGender(query.message, query.data)
        }
    }
})

bot.on("contact", (msg, metadata) => {
    let user = findUser(msg)

    if (user) {
        if (user.step === steps.PHONE) {
            onContact(msg, msg.contact.phone_number)
        }
    }
})

function onStart(msg) {
    let user = authorizeUser(msg) // 885671235
    requireName(user, msg)
}

function onName(msg) {
    let user = findUser(msg)
    user.name = msg.text

    requireGender(user, msg)
}


function onGender(msg, gender) {

    let user = findUser(msg)
    user.gender = gender

    requireContact(user, msg)
}

function onContact(msg, contact) {
    let user = findUser(msg)
    user.phone = contact

    requireEmail(user, msg)
}

function onEmail(msg) {
    let user = findUser(msg)
    user.email = msg.text

    requireAddress(user, msg)
}

function onAddress(msg) {
    let user = findUser(msg)
    user.address = msg.text

   complete(user, msg)
}

function requireName(user, msg) {
    bot.sendMessage(msg.chat.id, "Ismingizni kiriting")
    user.step = steps.NAME
}

function requireGender(user, msg) {
    let genders = {
        inline_keyboard : [
            [ { text: "Male", callback_data: "male" }, { text: "Female", callback_data: "female" } ]
        ]
    }
    bot.sendMessage(msg.chat.id, "Genderni tanlang:", { reply_markup: genders })
    user.step = steps.GENDER
}

function requireContact(user, msg) {
    bot.sendMessage(msg.chat.id, "Kontaktingizni yuboring", { reply_markup: {
        keyboard: [
            [ { text: "U+1F4DE Contact yuborish", request_contact: true } ]
        ],
        resize_keyboard: true,
    }})

    user.step = steps.PHONE
}

function requireEmail(user, msg) {
    bot.sendMessage(msg.chat.id, "Email ni kiriting:", { reply_markup: { remove_keyboard: true }})
    user.step = steps.EMAIL
}

function requireAddress(user, msg) {
    bot.sendMessage(msg.chat.id, "Addressingizni kiriting:")
    user.step = steps.ADDRESS
}

function complete(user, msg) {
    bot.sendMessage(msg.chat.id, "Siz royhatdan otdingiz!")

    sendToAdmin(user)
    sendToDatabase(user)
}


function sendToAdmin(user) {
    const message = `Янги фойдаланувчи, ${user.name}\n` +
                    `Жинси: ${user.gender} \n`+
                    `Email: ${user.email}\n`+
                    `Адрес: ${user.address}\n` +
                    `Телефон: ${user.phone}`;

    bot.sendMessage(process.env.adminID, message)
}

function sendToDatabase(user) {
    
    const dbUser = User({
        chatId: user.id,
        name: user.name,
        gender: user.gender,
        phone: user.phone,
        email: user.email,
        address: user.address
    })

    dbUser.save()
}

function findUser(msg) { // user | undefined
    return users[msg.chat.id]
}

function authorizeUser(msg) {
    const user = createUser(msg.chat.id)
    users[msg.chat.id] = user

    return user
}