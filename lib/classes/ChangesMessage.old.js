class ChangesMessage {
  constructor (items, caption) {
    this.items = items
    this.caption = caption

    this.fields = [
      ['name', true],
      ['description'],
      ['price', 'Цена'],
      ['phone', 'Тел.'],
      ['store', 'Магазин'],
      ['city', 'Гор.'],
      ['article', 'Артикул'],
      ['vendorCode', 'Код производителя']
    ]
  }

  renderField (display, value) {
    if (typeof display === 'string') {
      return `${display}: <b>${value}</b>`
    } else if (typeof display === 'function') {
      return display(value)
    } else {
      return display ? `<b>${value}</b>` : value
    }
  }

  renderItem (item) {
    const strings = []
    for (let [name, display] of this.fields) {
      const value = item[name]
      if (value) {
        strings.push(this.renderField(display, value))
      }
    }
    return strings.join('\n')
  }

  renderSection ([name, items]) {
    return `<b>++ ${name}</b>\n\n${items
      .map(this.renderItem, this)
      .join('\n\n')}`
  }

  render () {
    const sections = []

    for (let item of this.items) {
      let sorted = false
      for (let [name, sectionItems] of sections) {
        if (name === item.section) {
          sectionItems.push(item)
          sorted = true
        }
      }
      if (sorted) continue
      sections.push([item.section, [item]])
    }

    return `<b>${this.caption}</b>\n\n${sections
      .map(this.renderSection, this)
      .join('\n\n')}`
  }
}

module.exports = ChangesMessage
