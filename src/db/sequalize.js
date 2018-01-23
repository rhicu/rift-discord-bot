const config = require('./config')
const Sequelize = require('sequelize')
const db = new Sequelize(config.mysql.name, config.mysql.username, config.mysql.password, {
    host: config.mysql.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})
const Raid = db.import('./models/raid')
const Player = db.import('./models/player')

/** */
class Database {

    /**
     *
     * @param {Object} raidObject
     *
     * @return {Promise}
     */
    static addNewRaid(raidObject) {
        return Raid.sync().then(() => {
            return Raid.create(raidObject)
        })
    }

    /**
     *
     * @param {String} raidID
     *
     * @return {Promise}
     */
    static getRaidByID(raidID) {
        return Raid.sync().then(() => {
            return Raid.findById(raidID).then((result) => {
                return result.dataValues
            })
        })
    }

    /**
     *
     * @param {Object} playerObject
     *
     * @return {Promise}
     */
    static addNewPlayer(playerObject) {
        return Player.sync().then(() => {
            return Player.create(playerObject)
        })
    }

    /**
     *
     * @param {String} playerID 
     *
     * @return {Promise}
     */
    static getPlayerByID(playerID) {
        return Player.sync().then(() => {
            return Player.findById(playerID).then((result) => {
                return result.dataValues
            })
        })
    }
}

module.exports = Database
