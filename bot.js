require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(process.env.token, { polling: true })
bot.on('polling_error', console.log)

const step = {
    START   : 0,
    NAME    : 1,
    CONTACT : 2,
    GENDER  : 3,
    ADDRESS : 4
}

// ------------ Keyboards ------------ //

const startKeyboard = {
    inline_keyboard: [
        [ { text: "Start", callback_data: "start" } ]
    ]
}

// ------------ Logic ---------------- //

bot.on('message', (msg) => {

    if (msg.text === '/start') {

        const welcome = "Salom foydalanuvchi. " +
        "\nBiz hammani ma'lumotlarni yigamiz," +
        "agar siz ham oz malumotlaringizni ishonsangiz tugmani bosing"

        bot.sendPhoto(msg.chat.id, __dirname + "/images/preved.jpg", 
                        { caption: welcome, reply_markup : JSON.stringify(startKeyboard) }  
        )
    }
})