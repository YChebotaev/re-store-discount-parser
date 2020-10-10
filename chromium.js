const puppeteer = require('puppeteer')

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--disable-setuid-sandbox', '--no-sandbox']
  })
  const page = await browser.newPage()
  await page.setUserAgent(
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36'
  )
  await page.goto('https://re-store.ru/discount/')
}

main()
