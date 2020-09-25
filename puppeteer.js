const puppeteer = require('puppeteer')
const BrowserLauncher = require('./lib/classes/BrowserLauncher')

const config = {
  headless: false,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-notifications']
}

// if (process.platform === 'darwin') {
//   Object.assign(config, {
//     executablePath:
//       '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
//   })
// }

const launcher = new BrowserLauncher(config)

exports.launcher = launcher
exports.puppeteer = puppeteer
