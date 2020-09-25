const puppeteer = require('puppeteer')

class BrowserLauncher {
  constructor (options) {
    this.options = options
  }

  async launch () {
    return await puppeteer.launch(this.options)
  }
}

module.exports = BrowserLauncher
