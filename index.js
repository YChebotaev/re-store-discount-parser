require('dotenv').config()
const { nanoid } = require('nanoid')
const sequelize = require('./sequelize')
const { bot, nextDates } = require('./bot')
const DiscountJob = require('./jobs/DiscountJob')
const RunState = require('./models/RunState')

const runId = nanoid()
const jobs = new Set()

jobs.add(new DiscountJob(runId, '* * * * *'))

Promise.all([/* bot.launch(), */ sequelize.sync()]).then(async () => {
  Array.from(jobs).map(job => job.start())
  nextDates.injectJobs(jobs)
})

const exitCleanup = async code => {
  console.log('exitCleanup')
  await RunState.destroy({
    where: { id: runId },
    force: true
  })
  process.exit(code)
}

process.on('exit', exitCleanup)
process.on('SIGINT', exitCleanup)
process.on('SIGUSR1', exitCleanup)
process.on('SIGUSR2', exitCleanup)
process.on('uncaughtException', exitCleanup)
