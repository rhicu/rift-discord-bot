const PlayerConfig = require('./playerConfig')
const Player = require('./player')

/** */
class PlayerFactory {

    /**
     *
     * @param {String} input
     * @param {String} discordID
     * @return {Player}
     */
    static createPlayerFromUserInput(input, discordID) {
        try {
            if(input.length < 4) {
                return null
            }

            const ingameName = PlayerFactory.verifyName(input[0])
            const riftClass = PlayerFactory._verifyRiftClass(input[1])
            const roles = PlayerFactory._verifyRoles(input[2])
            const shortName = input[3]

            const newPlayer = new Player(discordID, ingameName, riftClass, roles, shortName)
            if(newPlayer) {
                return newPlayer
            } else {
                return null
            }
        } catch(error) {
            throw error
        }
    }

    /**
     *
     * @param {Object} dataBaseObject
     * @return {Player}
     */
    static createPlayerFromDatabaseObject(dataBaseObject) {
        if(!dataBaseObject) {
            return null
        }

        const discordID = dataBaseObject.discordID
        const ingameName = dataBaseObject.ingameName
        const riftClass = dataBaseObject.riftClass
        const roles = dataBaseObject.roles
        const shortName = dataBaseObject.shortName

        const newPlayer = new Player(discordID, ingameName, riftClass, roles, shortName)

        if(!newPlayer) {
            return null
        }

        newPlayer.id = dataBaseObject.id
        return newPlayer
    }

    /**
     *
     * @param {String} input
     * @return {String}
     */
    static verifyName(input) {
        const splittedName = input.split('@')
        const name = splittedName[0]
        let shard

        if(!splittedName[1] || splittedName[1] === '') {
            shard = PlayerConfig.defaultShard
        } else {
            shard = splittedName[1]
        }

        return name + '@' + shard
    }

    /**
     *
     * @param {String} input
     * @return {String}
     */
    static _verifyRiftClass(input) {
        for(const riftClass in PlayerConfig.riftClasses) {
            if(riftClass) {
                const validatedRiftClass = PlayerConfig.riftClasses[riftClass].filter((alias) => {
                    return (alias === input)
                })
                if(validatedRiftClass.length !== 0) {
                    return riftClass
                }
            }
        }
        throw new Error('Die Klasse konnten nicht validiert werden. Überprüfe die Eingabe!')
    }

    /**
     *
     * @param {String} input
     * @return {Object}
     */
    static _verifyRoles(input) {
        const roles = input.split(',')
        let verifiedRoles = {
            dd: false,
            heal: false,
            tank: false,
            support: false
        }

        roles.forEach((inputRole) => {
            for(const role in PlayerConfig.roles) {
                if(role) {
                    const validatedRole = PlayerConfig.roles[role].filter((alias) => {
                        return (alias === inputRole)
                    })
                    if(validatedRole.length !== 0) {
                        verifiedRoles[role] = true
                    }
                }
            }
        })
        if(!(verifiedRoles.dd || verifiedRoles.tank || verifiedRoles.heal || verifiedRoles.support)) {
            throw new Error('Die Rollen konnten nicht validiert werden. Überprüfe die Eingabe!')
        }
        return verifiedRoles
    }
}

module.exports = PlayerFactory
