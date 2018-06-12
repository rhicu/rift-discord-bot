/**
 *
 */
class Player {

    /**
     *
     * @param {String} discordID
     * @param {String} ingameName
     * @param {String} riftClass
     * @param {JSON} roles
     * @param {String} shortName
     */
    constructor(discordID, ingameName, riftClass, roles, shortName) {
        this.discordID = discordID
        this.ingameName = ingameName
        this.riftClass = riftClass
        this.roles = roles
        this.shortName = shortName
    }
}

module.exports = Player
