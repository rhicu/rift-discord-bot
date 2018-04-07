const config = require('../config.json')
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
class SequelizeInteractions {

    /** */
    static init() {
        Raid.sync({force: true})
        Player.sync({force: true})
    }
    /**
     * @param {Object} raidObject
     * @return {Promise}
     */
    static addOrUpdateRaid(raidObject) {
        return Raid.upsert(raidObject)
    }

    /**
     * @param {String} raidID
     * @return {Promise}
     */
    static getRaidByID(raidID) {
        return Raid.findById(raidID)
    }

    /**
     * @return {Raid[]}
     */
    static getRaidsToPrint() {
        return Raid.findAll({
            where: {
                display: true
            }
        })
    }

    /**
     * @param {Object} playerObject
     * @return {Promise}
     */
    static addOrUpdatePlayer(playerObject) {
        return Player.upsert(playerObject)
    }

    /**
     * @param {String} playerID
     * @return {Promise}
     */
    static getPlayerByID(playerID) {
        return Player.findById(playerID)
    }

    /**
     * @param {String} shortName
     * @param {String} discordID
     * @return {Promise}
     */
    static getPlayerByShortNameAndDiscordID(shortName, discordID) {
        return Player.findOne({
            where: {
                shortName: shortName,
                discordID: discordID
            }
        })
    }

    /**
     * @param {String} ingameName
     * @return {Promise}
     */
    static getPlayerByIngameName(ingameName) {
        return Player.findOne({
            where: {
                ingameName: ingameName
            }
        })
    }

    /**
     *
     * @param {String} shortName
     * @param {String} discordID
     * @return {Promise}
     */
    static deletePlayer(shortName, discordID) {
        return Player.destroy({
            where: {
                shortName: shortName,
                discordID: discordID
            }
        })
    }
}

module.exports = SequelizeInteractions
