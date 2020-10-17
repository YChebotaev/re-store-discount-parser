const { launcher } = require('../../puppeteer')

class PageObject {
  constructor () {
    this.browser = null
    this.page = null
  }

  async init () {
    this.browser = await launcher.launch()
    this.page = await this.browser.newPage()
    await this.page.setUserAgent(process.env.USER_AGENT)
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
    await this.page.close()
    await this.browser.close()

    this.page = null
    this.browser = null
  }
}

module.exports = PageObject
