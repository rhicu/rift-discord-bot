const db = require('./sequalize')
const RaidFactory = require('../raid/raidFactory')
const PlayerFactory = require('../user/playerFactory')
const util = require('../util/util')

/** */
class Database {

    /** */
    static init() {
        db.init()
    }

    /**
     * @param {Player} playerObject
     * @return {Promise<Boolean>}
     */
    static addOrUpdatePlayer(playerObject) {
        return db.addOrUpdatePlayer(playerObject)
            .catch((error) => {
                if(error.name === 'SequelizeUniqueConstraintError') {
                    throw new Error('This character has already been created by another person!')
                } else {
                    throw error
                }
            })
    }

    /**
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
            })
    }

    /**
     * @param {Number} playerID
     * @return {Promise<Player>}
     */
    static getPlayerByID(playerID) {
        return db.getPlayerByID(playerID)
            .then((result) => {
                if(!result || !result.dataValues) {
                    return null
                } else {
                    const newPlayer = PlayerFactory.createPlayerFromDatabaseObject(result.dataValues)
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
                            throw new Error('Couldn\'t create List of players')
                        }
                    } else {
                        throw new Error('Couldn\'t create List of players')
                    }
                })
        })
        return playerArray
    }

    /**
     * @param {String} shortName
     * @param {String} discordID
     * @return {Player}
     */
    static getPlayerByShortNameAndDiscordID(shortName, discordID) {
        return db.getPlayerByShortNameAndDiscordID(shortName, discordID)
            .then((result) => {
                if(!result || !result.dataValues) {
                    return null
                } else {
                    const newPlayer = PlayerFactory.createPlayerFromDatabaseObject(result.dataValues)
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
    static addOrUpdateRaid(raidObject) {
        return db.addOrUpdateRaid(raidObject)
    }

    /**
     * @param {Number} raidID
     * @return {Boolean}
     */
    static deleteRaid(raidID) {
        return db.deleteRaid(raidID)
            .then((result) => {
                if(result) {
                    return true
                } else {
                    return false
                }
            })
    }

    /**
     * @param {Number} raidID
     * @return {Number}
     */
    static getRaidByID(raidID) {
        return db.getRaidByID(raidID)
    }

    /**
     * @return {Raid[]}
     */
    static getRaidsToPrint() {
        return db.getRaidsToPrint()
            .then((result) => {
                const raidArray = []
                result.forEach((raidObject) => {
                    console.log(raidObject)
                    const raid = RaidFactory.recreateRaidFromDatabaseObject(raidObject.dataValues)
                    if(!raid) {
                        throw new Error('Couldn\'t get raids to print!')
                    }
                    util.pushRaidToArraySortedByDate(raidArray, raid)
                })
                return raidArray
            })
    }
}

module.exports = Database
