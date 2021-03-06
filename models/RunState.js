const { DataTypes } = require('sequelize')
const sequelize = require('../sequelize')
const { DateTime } = require('luxon')

const RunState = sequelize.define('RunState', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  firstRun: {
    type: DataTypes.BOOLEAN
  },
  lastCheck: {
    type: DataTypes.DATE
  },
  blocked: {
    type: DataTypes.BOOLEAN
  },
  blockedBy: {
    type: DataTypes.STRING
  }
})

module.exports = RunState
