const { DataTypes } = require('sequelize')
const sequelize = require('../sequelize')

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  section: {
    type: DataTypes.STRING
  },
  name: {
    type: DataTypes.STRING
  },
  store: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING
  },
  price: {
    type: DataTypes.STRING
  },
  oldPrice: {
    type: DataTypes.STRING
  },
  city: {
    type: DataTypes.STRING
  },
  article: {
    type: DataTypes.STRING
  },
  vendorCode: {
    type: DataTypes.STRING
  },
  screenshot: {
    type: DataTypes.VIRTUAL
  }
})

module.exports = Item
