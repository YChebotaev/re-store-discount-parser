const { launcher } = require('../../puppeteer')
const execa = require('execa')

class PageObject {
  constructor () {
    this.browser = null
    this.page = null
  }

  async init () {
    this.browser = await launcher.launch()
    this.page = await this.browser.newPage()
    await this.page.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'
    )
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

    // await this._ensureBrowserClosed()

    this.page = null
    this.browser = null
  }

  async _ensureBrowserClosed () {
    const stillAlive = await this._isBrowserAlive()
    if (stillAlive) {
      await this._forceKillBrowser()
    }
  }

  async _isBrowserAlive () {
    const proc = await this.browser.process()
    console.log(proc)
    return true
  }

  async _forceKillBrowser () {
    const proc = await this.browser.process()
    await execa('kill', [proc.pid])
  }
}

module.exports = PageObject
