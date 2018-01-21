const config = require('../config')
const Sequelize = require('sequelize')
const db = new Sequelize(config.mysql.name, config.mysql.username, config.mysql.password, {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})
const Raid = db.import('./models/raid')

Raid.sync({force: true})
    .then(() => {
        // Table created
        Raid.create({
            type: 'irotp',
            start: Date.now(),
            end: Date.now(),
            raidLead: 'icke',
            messageID: '12345',
            member: {
                registered: ['284owfif93', 'wjfo9874198'],
                confirmed: ['jpofpwf8890']
            }
        })
    })
