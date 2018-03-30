const db = require('./sequalize')
const RaidFactory = require('../raid/raidFactory')
const PlayerFactory = require('../user/playerFactory')

/** */
class Database {

    /** */
    static init() {
        db.init()
    }

    /**
     *
     * @param {Player} playerObject
     * @return {Promise<Boolean>}
     */
    static addOrUpdatePlayer(playerObject) {
        return db.addOrUpdatePlayer(playerObject)
            .catch((error) => {
                if(error.name === 'SequelizeUniqueConstraintError') {
                    throw new Error('This character has already been created by another person!')
                }
            })
    }

    /**
     *
     * @param {Player} playerObject
     * @return {Promise<Boolean>}
     */
    static isEntitledToUpdatePlayer(playerObject) {
        return db.getPlayerByIngameName(playerObject.ingameName)
            .then((result) => {
                if(result) {
                    if(result.dataValues.discordID === playerObject.discordID) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return true
                }
            }).catch((error) => {
                throw error
            })
    }

    /**
     *
     * @param {String} playerID
     * @return {Promise<Player>}
     */
    static getPlayerByID(playerID) {
        return db.getPlayerByID(playerID)
            .then((result) => {
                if(!result && !result.dataValues) {
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
     *
     * @param {String} shortName
     * @param {String} discordID
     * @return {Player}
     */
    static getPlayerByShortNameAndDiscordID(shortName, discordID) {
        return db.getPlayerByShortNameAndDiscordID(shortName, discordID)
            .then((result) => {
                if(!result && !result.dataValues) {
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
     *
     * @param {String} shortName
     * @param {String} discordID
     * @return {Promise<Boolean>}
     */
    static deletePlayer(shortName, discordID) {
        return db.deletePlayer(shortName, discordID)
            .then((result) => {
                if(result) {
                    return true
                } else {
                    return false
                }
            })
    }

    /**
     * @param {Raid} raidObject
     * @return {Promise<Boolean>}
     */
    static addRaid(raidObject) {
        return db.addRaid(raidObject)
            .catch((error) => {
                throw error
            })
    }

    /**
     *
     * @param {String} raidID
     */
    static getRaidByID(raidID) {

    }
}

module.exports = Database
