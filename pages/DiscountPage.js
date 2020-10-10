const PageObject = require('../lib/classes/PageObject')
const { DateTime } = require('luxon')
const DiscountSection = require('./sections/discountPage/DiscountSection')
const supress = require('../lib/utils/supress')
const SECTIONS = require('../constants/sections')

class DiscountPage extends PageObject {
  async open () {
    await super.open('https://www.re-store.ru/discount/')
    try {
      await this.page.waitForNavigation({
        timeout: 60 * 1000
      })
    } catch (error) {
      if (error.message.includes('Navigation timeout of')) {
        supress(error)
      }
    } finally {
      await this.page.waitFor(6 * 1000)
    }
  }

  async confirmGuessedLocation () {
    try {
      await this.page.waitForSelector('.choose-city-cont', {
        visible: true,
        timeout: 6 * 1000
      })
      await this.page.click('.accept-city')
    } catch (error) {
      if (
        error.message.includes(
          'Node is either not visible or not an HTMLElement'
        )
      ) {
        supress(error)
      } else if (
        error.message.includes(
          'waiting for selector ".choose-city-cont" failed'
        )
      ) {
        supress(error)
      } else {
        throw error
      }
    }
  }

  async closeSubscription () {
    await this.page.waitForSelector('.cornersubscription')
    await this.page.$eval('.cornersubscription .close', el => el.click())
  }

  async selectCity (cityName) {
    this.city = cityName
    await this.page.waitForSelector('.r-discount-top__city-picker', {
      visible: true
    })
    await this.page.click('.r-discount-top__city-picker')
    await this.page.waitForSelector('.choose-city-list-cont', { visible: true })
    await this.page.$eval(`[data-city="${cityName}"]`, el => el.click())
    await this.page.waitForSelector('.r-discount-top__city-picker', {
      hidden: true
    })
  }

  async $discountSections () {
    return this.$sections('.r-discount-section', DiscountSection)
  }

  async getSections () {
    const sections = []

    await this.page.waitForSelector('.r-discount-sections-wrap')

    for (let section of await this.$discountSections()) {
      const sectionTitle = await section.getTitle()
      if (SECTIONS.includes(sectionTitle)) {
        sections.push(section)
      }
    }

    return sections
  }

  async getUpdateTime () {
    const updateTimeText = await this.page.$eval(
      '.r-discount-search__update-time',
      el => el.innerText
    )
    const dateTime = DateTime.fromFormat(updateTimeText, 'HH:mm', {
      zone: process.env.ZONE
    })

    return new Date(dateTime.toISO())
  }
}

module.exports = DiscountPage
