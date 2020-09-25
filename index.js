require('dotenv').config()
const { nanoid } = require('nanoid')
const sequelize = require('./sequelize')
const { bot, nextDates } = require('./bot')
const DiscountJob = require('./jobs/DiscountJob')
const RunState = require('./models/RunState')

const runId = nanoid()
const jobs = new Set()

if (process.env.NODE_ENV === 'production') {
  // jobs.add(new DiscountJob(runId, '*/10 7-22 * * 1', 'Europe/Moscow'))
  // jobs.add(new DiscountJob(runId, '15 * * * * *', 'Europe/Moscow'))
  jobs.add(new DiscountJob(runId, '15 7-22 * * *', 'Europe/Moscow'))
} else if (process.env.NODE_ENV === 'development') {
  const job = new DiscountJob(runId, '*/10 * * * *', 'Europe/Moscow')
  jobs.add(job)
  console.log(`Job will run at ${job.nextDate().format('hh:mm Z')}`)
}

Promise.all([bot.launch(), sequelize.sync()]).then(async () => {
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
