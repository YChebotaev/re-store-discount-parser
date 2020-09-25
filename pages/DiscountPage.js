const PageObject = require('../lib/classes/PageObject')
const DiscountSection = require('./sections/discountPage/DiscountSection')
const supress = require('../lib/utils/supress')
const SECTIONS = require('../constants/sections')

class DiscountPage extends PageObject {
  async open () {
    await super.open('https://www.re-store.ru/discount/')
    await this.page.waitFor(10 * 1000)
  }

  async confirmGuessedLocation () {
    try {
      await this.page.waitForSelector('.choose-city-cont', {
        visible: true,
        timeout: 5 * 1000
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

  // async getItems (sectionNames) {
  //   const items = []
  //   await this.page.waitForSelector('.r-discount-sections-wrap')

  //   const sections = await this.$discountSections()

  //   for (let section of sections) {
  //     const sectionTitle = await section.getTitle()
  //     if (sectionNames.includes(sectionTitle)) {
  //       await section.expand()
  //       const sectionItems = await section.getItems()
  //       for (let item of sectionItems) {
  //         item.section = sectionTitle
  //         item.city = this.city
  //         items.push(item)
  //       }
  //     }
  //   }

  //   return items
  // }
}

module.exports = DiscountPage
