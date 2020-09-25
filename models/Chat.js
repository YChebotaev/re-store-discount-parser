const { DataTypes } = require('sequelize')
const sequelize = require('../sequelize')

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  lastSendTime: {
    type: DataTypes.DATE
  }
})

Chat.prototype.sendMessage = async function (telegram, message) {
  this.lastSendTime = new Date()
  await telegram.sendMessage(message.forChatId, message.toString(), {
    parse_mode: message.parseMode,
    disable_notification: this.getIsSilent()
  })
  await this.save()
}

Chat.prototype.getIsSilent = async function () {
  const { lastSendTime } = this
  if (new Date() - lastSendTime < 60 * 1000) {
    return true
  } else {
    return false
  }
}

module.exports = Chat
