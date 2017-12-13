const Mongo = require('./mongo')
const Player = require('../player')
const RaidFactory = require('../raid/raidFactory')

/** */
class Database {

    /** */
    constructor() {}

    /**
     *
     * @param {Player} newCharacter
     *
     * @return {Boolean}
     */
    static addPlayer(newCharacter) {
        return Mongo.savePlayerInDatabase(newCharacter)
    }

    /**
     *
     * @param {String} playerID
     * @param {String} shortName
     *
     * @return {Player}
     */
    static getPlayer(playerID, shortName) {
        return Mongo.getGameCharacterFromDatabase(playerID, shortName)
            .then((result) => {
                if(result) {
                    let newPlayer = new Player(result.id, result.ingameName, result.riftClass, result.roles, result. shortName)
                    return newPlayer
                } else {
                    return null
                }
            })
    }
}

module.exports = Database
