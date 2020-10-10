const { CronJob } = require('cron')
const { nanoid } = require('nanoid')
const {
  bot: { telegram }
} = require('../bot')
const DiscountPage = require('../pages/DiscountPage')
const ItemMessage = require('../lib/classes/ItemMessage')
const Item = require('../models/Item')
const Chat = require('../models/Chat')
const RunState = require('../models/RunState')
const CITIES = require('../constants/cities')
const parsePrice = require('../lib/utils/parsePrice')

class DiscountJob extends CronJob {
  constructor (runId, time) {
    const run = async () => {
      let jobId, discountPage, runState
      try {
        jobId = nanoid()

        runState = await this.getOrCreateRunState()

        if (runState.blocked) return

        runState.blocked = true
        runState.blockedBy = jobId
        await runState.save()

        discountPage = new DiscountPage()
        await discountPage.init()
        await discountPage.open()
        await discountPage.confirmGuessedLocation()

        if (process.env.PUPPETEER_HEADLESS === 'no') {
          await discountPage.closeSubscription()
        }

        const updateTime = await discountPage.getUpdateTime()
        const diff = updateTime - runState.lastCheck

        if (!runState.firstRun && runState.lastCheck && diff) {
          const chats = await Chat.findAll()

          for (let city of CITIES) {
            await discountPage.selectCity(city)

            const sections = await discountPage.getSections()

            for (let section of sections) {
              await section.expand()

              for (let data of await section.getItems()) {
                data.section = await section.getTitle()
                data.city = city

                if (parsePrice(data.price) >= 10000) {
                  await this.notifySectionItem(chats, data, runState.firstRun)
                }
              }
            }
          }
        }

        runState.lastCheck = updateTime
        runState.firstRun = false
        await runState.save()
      } catch (error) {
        throw error
      } finally {
        if (discountPage) await discountPage.close()

        if (runState.blockedBy === jobId) {
          runState.blockedBy = ''
          runState.blocked = false
          await runState.save()
        }
      }
    }

    super(time, run, null, false, process.env.ZONE)

    Object.assign(this, { runId })
  }

  async notifySectionItem (chats, data, isFirstRun) {
    const [item, isNew] = await Item.findOrCreate({
      where: { id: data.id },
      defaults: data
    })

    if (!isFirstRun) {
      for (let chat of chats) {
        const message = new ItemMessage(chat, item, isNew)
        await chat.sendMessage(telegram, message)
      }
    }
  }

  async getOrCreateRunState () {
    const [runState] = await RunState.findOrCreate({
      where: { id: this.runId },
      defaults: { id: this.runId, firstRun: true }
    })

    return runState
  }
}

module.exports = DiscountJob
