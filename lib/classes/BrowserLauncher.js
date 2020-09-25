const puppeteer = require('puppeteer')

class BrowserLauncher {
  constructor (options) {
    this.options = options
    this.browser = null
  }

  async launch () {
    let { browser } = this

    if (browser) return browser

    browser = await puppeteer.launch(this.options)

    this.browser = browser

    browser.once('targetdestroyed', () => (this.browser = null))

    return browser
  }

  getInstance () {
    return this.browser
  }
}

module.exports = BrowserLauncher
