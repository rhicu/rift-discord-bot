/**
 * 
 */
class Player {

    /** */
    static newPlayer() {}

    /**
     *
     * @param {Array} databaseArray
     *
     * @return {Array}
     */
    static generatePlayerArrayFromDatabaseObjectArray(databaseArray) {
        let playerArray = []
        databaseArray.forEach((databasePlayerObject) => {
            let player = Player.toString(databasePlayerObject)
            playerArray.push(player)
        })
        return playerArray
    }

    /**
     *
     * @param {Object} playerObject
     *
     * @return {String}
     */
    static toString(playerObject) {
        return `${playerObject.ingameName} - ${playerObject.roles} (${playerObject.riftClass})`
    }
}

module.exports = Player
