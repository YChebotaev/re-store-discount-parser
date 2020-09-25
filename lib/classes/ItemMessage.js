const FIELDS = require('../../constants/fields')

class ChangesMessage {
  constructor (chat, item, isNew) {
    this.chat = chat
    this.item = item
    this.isNew = isNew
    this.parseMode = 'HTML'
  }

  get forChatId () {
    return this.chat.id
  }

  get city () {
    return this.item.city
  }

  get section () {
    return this.item.section
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

  renderItem () {
    const { item } = this
    const strings = []
    for (let [name, display] of FIELDS) {
      const value = item[name]
      if (value) {
        strings.push(this.renderField(display, value))
      }
    }
    return strings.join('\n')
  }

  toString () {
    const cityHeader = this.isNew
      ? `Новые поступления в ${this.city}!`
      : `Обновления позиций в ${this.city}!`
    const sectionHeader = `<b>${this.section}</b>`
    const body = '\n' + this.renderItem()

    return [cityHeader, sectionHeader, body].join('\n')
  }
}

module.exports = ChangesMessage
