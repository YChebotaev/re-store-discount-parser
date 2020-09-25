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
  constructor (runId, time, timezone) {
    const run = async () => {
      let jobId, discountPage
      try {
        jobId = nanoid()
        discountPage = new DiscountPage()
        const isFirstRun = await this.isFirstRun()

        const chats = await Chat.findAll()

        await discountPage.init()
        await discountPage.open()
        await discountPage.confirmGuessedLocation()

        if (process.env.PUPPETEER_HEADLESS === 'no') {
          await discountPage.closeSubscription()
        }

        for (let city of CITIES) {
          await discountPage.selectCity(city)

          const sections = await discountPage.getSections()

          for (let section of sections) {
            await section.expand()

            for (let data of await section.getItems()) {
              data.section = await section.getTitle()
              data.city = city

              if (parsePrice(data.price) >= 10000) {
                await this.notifySectionItem(chats, data, isFirstRun)
              }
            }
          }
        }

        await this.setFirstRun(true)
      } catch (error) {
        throw error
      } finally {
        await discountPage.close()
      }
    }

    super(time, run, null, false, timezone)

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

  async isFirstRun () {
    const state = await RunState.findByPk(this.runId)
    if (state) {
      return state.isFirstRun
    }
    return true
  }

  async setFirstRun (isFirstRun) {
    const [state, isNew] = await RunState.findOrCreate({
      where: {
        id: this.runId
      },
      defaults: {
        id: this.runId,
        firstRun: isFirstRun
      }
    })
    if (state && !isNew) {
      state.isFirstRun = isFirstRun
      await state.save()
    }
  }
}

module.exports = DiscountJob
