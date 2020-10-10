const PageSection = require('../../../lib/classes/PageSection')
const supress = require('../../../lib/utils/supress')

class DiscountSection extends PageSection {
  async expand () {
    const btnMore = await this.el.$('.r-discount-section__btn-more')

    if (!btnMore) return

    try {
      await btnMore.click()

      const xPathHandle = await this.page.page.evaluateHandle(btn => {
        function getXPathForElement (element) {
          const idx = (sib, name) =>
            sib
              ? idx(sib.previousElementSibling, name || sib.localName) +
                (sib.localName == name)
              : 1
          const segs = elm =>
            !elm || elm.nodeType !== 1
              ? ['']
              : elm.id && document.getElementById(elm.id) === elm
              ? [`id("${elm.id}")`]
              : [
                  ...segs(elm.parentNode),
                  `${elm.localName.toLowerCase()}[${idx(elm)}]`
                ]
          return segs(element).join('/')
        }

        return getXPathForElement(btn)
      }, btnMore)

      const xPath = await xPathHandle.jsonValue()

      await this.page.page.waitForXPath(xPath, {
        hidden: true
      })

      await this.page.page.waitFor(5 * 1000)
    } catch (error) {
      if (
        error.message.includes(
          'Node is either not visible or not an HTMLElement'
        )
      ) {
        supress(error)
      } else {
        throw error
      }
    }
  }

  getTitle () {
    return this.el.$eval('.r-discount-section__title', el => el.innerText)
  }

  async getItems () {
    const items = []
    const rows = await this.el.$$('.r-discount-table__row')

    rows.splice(0, 1)

    for (let row of rows) {
      const item = {}

      item.id = await row.$eval(
        '.r-discount-table__btn-buy',
        el => el.dataset.productId
      )

      item.article = await row.$eval(
        '.r-discount-table__product-article',
        el => el.innerText
      )

      item.vendorCode = await row.$eval(
        '.r-discount-table__product-vendor-code',
        el => el.innerText
      )

      item.name = await row.$eval(
        '.r-discount-table__product-name',
        el => el.innerText
      )

      item.store = await row.$eval(
        '.r-discount-table__store-name',
        el => el.innerText
      )

      item.phone = await row.$eval(
        '.r-discount-table__store-phone',
        el => el.innerText
      )

      item.description = await row.$eval(
        '.r-discount-table__col_description',
        el => el.innerText
      )

      item.price = await row.$eval(
        '.r-discount-table__product-price-current',
        el => el.innerText
      )

      // const { width, height } = await row.boundingBox()
      // item.screenshot = {
      //   width,
      //   height,
      //   buffer: await row.screenshot()
      // }

      items.push(item)
    }
    return items
  }
}

module.exports = DiscountSection
