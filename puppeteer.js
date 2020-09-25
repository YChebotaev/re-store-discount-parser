const puppeteer = require('puppeteer')
const BrowserLauncher = require('./lib/classes/BrowserLauncher')

const launcher = new BrowserLauncher({
  timeout: 0,
  headless: process.env.PUPPETEER_HEADLESS === 'yes',
  args: [
    // '--disable-gpu', //
    // '--disable-dev-shm-usage', //
    '--disable-setuid-sandbox',
    // '--no-first-run',
    '--no-sandbox'
    // '--no-zygote', //
    // '--single-process' //
    // '--disable-notifications' //
  ]
})

exports.launcher = launcher
exports.puppeteer = puppeteer
