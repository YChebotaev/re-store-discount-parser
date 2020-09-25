const { Telegraf } = require('telegraf')
const StartCommand = require('./commands/start')
const NextDatesCommand = require('./commands/next_dates')

const start = new StartCommand()
const nextDates = new NextDatesCommand()

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(start.getHandler())
bot.command(nextDates.getToken(), nextDates.getHandler())

exports.bot = bot
exports.start = start
exports.nextDates = nextDates
