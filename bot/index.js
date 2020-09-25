const { Telegraf } = require('telegraf')
const onStart = require('./commands/start')

const bot = new Telegraf('1343186647:AAHLzYPON6yMSSMd3nqB9pXXk3baOmPITx8')

bot.start(onStart)

module.exports = bot
