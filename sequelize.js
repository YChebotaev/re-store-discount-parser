const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE)

module.exports = sequelize
