const Sequelize = require('sequelize')
const config = require('../config')

const connection = new Sequelize(config.mysql.name, config.mysql.username, config.mysql.password)

const Raid = connection.import('./models/raid')

