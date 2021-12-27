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

bot.on('message', (msg) => {
    if (msg.text === "/start") {
        const keyboard = {
            inline_keyboard: [ 
                [ { text: "Start" , callback_data: "start" } ]
            ]
        }
        bot.sendMessage(msg.chat.id, "Salom men Anketa bot man, davom qildasmi?", { reply_markup: keyboard  })
    }
    else {

        const user = users[msg.from.id]

        if (user.step === steps.NAME) {
            user.name = msg.text
            
            const keyboard = {
                inline_keyboard: [ 
                    [ { text: "Erkak" , callback_data: "male" }, {text : "Ayol", callback_data: "female" } ]
                ]
            }

            bot.req

            bot.sendMessage(msg.chat.id, "Jinsingizni tanlang:", { reply_markup: keyboard })
            bot.deleteMessage(msg.chat.id, msg.message_id)

            user.step = steps.GENDER;
        }
    }
})

bot.on("callback_query", (query) => {
    if (query.data === "start") {
        const id = query.from.id
        const user = createUser(id)
        users[id] = user

        bot.sendMessage(query.message.chat.id, "Ismingizni kiriting!")

        bot.deleteMessage(query.message.chat.id, query.message.message_id)
        user.step = steps.NAME;
    }
    else {

        const user = users[query.from.id]

        if (user.step === steps.GENDER) {
            user.gender = query.data

            bot.sendMessage(query.message.chat.id, "Telefon raqaminingizni kiriting:", {
                reply_markup: {
                    keyboard: [
                        [{text: "Send Contact", callback_data: "send_contact", request_contact: true}]
                    ]
                }
            })
            bot.deleteMessage(query.message.chat.id, query.message.message_id)

            user.step = steps.PHONE
        }
    }
})

bot.on("contact", (msg, metadata) => {
    console.log(msg);
    console.log(metadata);
})