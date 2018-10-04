const config = require('../config.json')
const RaidFactory = require('../raid/raidFactory')
const PlayerFactory = require('../user/playerFactory')
const util = require('../util/util')

const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = new Sequelize(config.database.name, config.database.username, config.database.password, {
    host: config.database.host,
    dialect: config.database.dialect,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false
})

const Raid = db.import('./models/raid')
const Player = db.import('./models/player')

/** */
class Database {

    /** */
    static init() {
        Raid.sync()
        Player.sync()
    }

    /**
     * @param {Object} raidObject
     * @return {Promise}
     */
    static addOrUpdateRaid(raidObject) {
        return Raid.upsert(raidObject)
    }

    /**
     *
     * @param {Player} playerObject
     * @return {Promise<Boolean>}
     */
    static isEntitledToUpdatePlayer(playerObject) {
        return Database.getPlayerByIngameName(playerObject.ingameName)
            .then((result) => {
                if(result) {
                    if(result.discordID === 'GUEST' || result.discordID === playerObject.discordID) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return true
                }
            })
    }

    /**
     * @param {String} raidID
     * @return {Promise}
     */
    static getRaidByID(raidID) {
        return Raid.findById(raidID)
            .then((result) => {
                if(!result || !result.dataValues) {
                    return null
                } else {
                    const newRaid = RaidFactory.recreateRaidFromDatabaseObject(result)
                    if(newRaid) {
                        return newRaid
                    } else {
                        return null
                    }
                }
            })
    }

    /**
     * @return {Promise<Raid[]>}
     */
    static getRaidsToPrint() {
        return Raid.findAll({
            where: {
                shouldBeDisplayed: true
            }
        }).then((result) => {
            const raidArray = []
            result.forEach((raidObject) => {
                const raid = RaidFactory.recreateRaidFromDatabaseObject(raidObject)
                if(!raid) {
                    throw new Error('Konnte auszugebene Raids nicht finden!')
                }
                util.pushRaidToArraySortedByDate(raidArray, raid)
            })
            return raidArray
        })
    }

    /**
     * @param {Integer} raidID
     * @return {Promise}
     */
    static deleteRaid(raidID) {
        return Raid.destroy({
            where: {
                id: raidID
            }
        }).then((result) => {
            if(result) {
                return true
            } else {
                return false
            }
        })
    }

    /**
     * @param {Object} playerObject
     * @return {Promise}
     */
    static addOrUpdatePlayer(playerObject) {
        return Player.upsert(playerObject)
            .catch((error) => {
                if(error.name === 'SequelizeUniqueConstraintError') {
                    throw new Error('Dieser Charakter wurde bereits von jemand anderem erstellt!')
                } else {
                    throw error
                }
            })
    }

    /**
     * @param {String} playerID
     * @return {Promise}
     */
    static getPlayerByID(playerID) {
        return Player.findById(playerID)
            .then((result) => {
                if(!result || !result.dataValues) {
                    return null
                } else {
                    const newPlayer = PlayerFactory.createPlayerFromDatabaseObject(result)
                    if(newPlayer) {
                        return newPlayer
                    } else {
                        return null
                    }
                }
            })
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
        }).then((result) => {
            if(!result || !result.dataValues) {
                return null
            } else {
                const newPlayer = PlayerFactory.createPlayerFromDatabaseObject(result)
                if(newPlayer) {
                    return newPlayer
                } else {
                    return null
                }
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
        }).then((result) => {
            if(!result || !result.dataValues) {
                return null
            } else {
                const newPlayer = PlayerFactory.createPlayerFromDatabaseObject(result)
                if(newPlayer) {
                    return newPlayer
                } else {
                    return null
                }
            }
        })
    }

    /**
     * @param {String[]} ingameNames
     * @param {String} discordID
     * @return {Promise}
     */
    static getPlayerByNameArrayAndDiscordID(ingameNames, discordID) {
        return Player.findOne({
            where: {
                [Op.and]: [
                    {
                        discordID: discordID
                    }, {
                        ingameName: {
                            [Op.or]: ingameNames
                        }
                    }
                ]
            }
        }).then((result) => {
            if(!result || !result.dataValues) {
                return null
            } else {
                const newPlayer = PlayerFactory.createPlayerFromDatabaseObject(result)
                if(newPlayer) {
                    return newPlayer
                } else {
                    return null
                }
            }
        })
    }

    /**
     * @param {Array<Integer>} playerIDs
     * @return {Promise<Player[]>}
     */
    static getArrayOfPlayersByID(playerIDs) {
        let playerArray
        playerIDs.forEach((playerID) => {
            Database.getPlayerByID(playerID)
                .then((playerObject) => {
                    if(playerObject) {
                        const newPLayer = PlayerFactory.createPlayerFromDatabaseObject(playerObject)
                        if(newPLayer) {
                            playerArray.push(newPLayer)
                        } else {
                            throw new Error('Konnte keine Spielerliste erstellen!')
                        }
                    } else {
                        throw new Error('Konnte keine Spielerliste erstellen!')
                    }
                })
        })
        return playerArray
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
        }).then((result) => {
            if(result) {
                return true
            } else {
                return false
            }
        })
    }
}

module.exports = Database
