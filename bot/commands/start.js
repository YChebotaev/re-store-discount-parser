const Chat = require('../../models/Chat')

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

module.exports = start
