const { DataTypes } = require('sequelize')
const sequelize = require('../sequelize')

const RunState = sequelize.define('RunState', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  firstRun: {
    type: DataTypes.BOOLEAN
  }
})

module.exports = RunState
