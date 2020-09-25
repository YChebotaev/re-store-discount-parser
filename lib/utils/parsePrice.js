const parsePrice = priceStr => {
  priceStr = priceStr.replace(/ /g, '')
  priceStr = priceStr.substring(0, priceStr.length - 1)
  return Number(priceStr)
}

module.exports = parsePrice
