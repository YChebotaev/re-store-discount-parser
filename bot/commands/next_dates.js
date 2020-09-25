const BotCommand = require('../../lib/classes/BotCommand')

class NextDatesCommand extends BotCommand {
  injectJobs (jobs) {
    this.jobs = jobs
  }

  getToken () {
    return 'next_dates'
  }

  getHandler () {
    return async ctx => {
      const allDates = []

      for (let job of this.jobs) {
        allDates.push(job.nextDates())
      }

      allDates.sort((a, b) => b - a)

      ctx.reply(
        allDates.map(d => d.format('DD.MM.YYYY hh:mm:ss (Z)')).join('\n')
      )
    }
  }
}

module.exports = NextDatesCommand
