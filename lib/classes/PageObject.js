const { launcher } = require('../../puppeteer')
const supress = require('../utils/supress')

class PageObject {
  constructor () {
    this.page = null
  }

  get browser () {
    return launcher.getInstance()
  }

  async init () {
    const browser = await launcher.launch()

    this.page = await browser.newPage()

    return this
  }

  async open (url) {
    return await this.page.goto(url, {
      timeout: 0
    })
  }

  async $section (selector, SectionClass) {
    return new SectionClass(this, await this.page.$(selector))
  }

  async $sections (selector, SectionClass) {
    return (await this.page.$$(selector)).map(el => new SectionClass(this, el))
  }

  async close () {
    if (this.page != null) {
      try {
        await this.page.close()
      } catch (error) {
        if (
          error.message.includes(
            'Node is either not visible or not an HTMLElement'
          )
        ) {
          supress(error)
        }
      } finally {
        this.page = null
      }
    }
  }
}

module.exports = PageObject
