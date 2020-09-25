class BotCommand {
  getToken () {
    throw new Error(`"getToken" must be overriden in subclass`)
  }

  getHandler () {
    return () => {
      throw new Error(`"getHandler" must be overriden in subclass`)
    }
  }
}

module.exports = BotCommand
