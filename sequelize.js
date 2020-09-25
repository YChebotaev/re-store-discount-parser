const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('sqlite::memory:')
// const sequelize = new Sequelize('sqlite:./db.sqlite3')

module.exports = sequelize
