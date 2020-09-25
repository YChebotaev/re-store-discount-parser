const BotCommand = require('../../lib/classes/BotCommand')
const Chat = require('../../models/Chat')

class StartCommand extends BotCommand {
  getHandler() {
    return async ctx => {
      const [chat, created] = await Chat.findOrCreate({
        where: {
          id: ctx.chat.id
        },
        defaults: {
          id: ctx.chat.id
        }
      })
    
      return [chat, created]
    }
  }
}

module.exports = StartCommand

/*
const start = async ctx => {
  const [chat, created] = await Chat.findOrCreate({
    where: {
      id: ctx.chat.id
    },
    defaults: {
      id: ctx.chat.id
    }
  })

  return [chat, created]
}
*/

// module.exports = start
