const { nanoid } = require('nanoid')
const sequelize = require('./sequelize')
const bot = require('./bot')
const DiscountJob = require('./jobs/DiscountJob')
const RunState = require('./models/RunState')

const runId = nanoid()
const jobs = new Set()

// jobs.add(new DiscountJob(runId, '*/10 7-22 * * 1', 'Europe/Moscow'))
// jobs.add(new DiscountJob(runId, '15 00 * * * *', 'Europe/Moscow'))
jobs.add(new DiscountJob(runId, '*/3 * * * *', 'Europe/Moscow'))

Promise.all([bot.launch(), sequelize.sync()]).then(() => {
  Array.from(jobs).map(job => job.start())
})

const exitCleanup = async () => {
  console.log('exitCleanup')
  await RunState.destroy({
    where: { id: runId },
    force: true
  })
}

process.on('exit', exitCleanup)
process.on('SIGINT', exitCleanup)
process.on('SIGUSR1', exitCleanup)
process.on('SIGUSR2', exitCleanup)
process.on('uncaughtException', exitCleanup)
