/**
 *
 */
class Player {

    /**
     *
     * @param {String} id
     * @param {String} ingameName
     * @param {String} riftClass
     * @param {JSON} roles
     * @param {String} shortName
     */
    constructor(id, ingameName, riftClass, roles, shortName) {
        this.id = id
        this.ingameName = ingameName
        this.riftClass = riftClass
        this.roles = roles
        this.shortName = shortName
    }

    /**
     * @return {String}
     */
    toString() {
        return `${this.ingameName} - ${this.roles} (${this.riftClass})`
    }
}

module.exports = Player
