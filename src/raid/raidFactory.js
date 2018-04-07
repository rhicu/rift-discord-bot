const config = require('./raidConfig')
const Raid = require('./raid')
const Time = require('../util/time')

/** */
class RaidFactory {

    /**
     * @param {String} splittedInput
     * @return {Raid}
     */
    static createRaidFromUserInput(splittedInput) {
        try {
            if(splittedInput.length < 3) {
                return null
            }

            const messageID = ''
            const recurring = false
            const recurringMember = {
                player: {}
            }
            const mainRaid = false
            const display = true
            const member = {
                registered: {},
                confirmed: {},
                deregistered: {}
            }

            const type = RaidFactory._getType(splittedInput[0])
            const date = Time._generateDate(splittedInput[1])
            if(!type || !date) {
                return null
            }


            let start
            let end
            switch(splittedInput.length) {
                case 3:
                    start = Time._verifyTime(config.defaultStartingTime)
                    end = Time._verifyTime(config.defaultEndingTime)
                    break
                case 5:
                    start = Time._verifyTime(splittedInput[2])
                    end = Time._verifyTime(splittedInput[3])
                    break
                default:
                    throw new Error('You have to declare either start and end time or none of them!')
            }
            if(!start || !end) {
                return null
            }

            const raidLeadName = RaidFactory._getRaidLeadName(splittedInput[4])

            return new Raid(type, start, end, raidLeadName, messageID, member, recurring, recurringMember, mainRaid, display)
        } catch(error) {
            throw error
        }
    }

    /**
     * @param {Object} dataBaseObject
     * @return {Raid}
     */
    static recreateRaidFromDatabaseObject(dataBaseObject) {
        if(dataBaseObject) {
            let date = new Date(dataBaseObject.date)
            return new Raid(dataBaseObject.id, dataBaseObject.type, date, dataBaseObject.start, dataBaseObject.end, dataBaseObject.raidLead, dataBaseObject.messageID)
        } else {
            return null
        }
    }

    /**
     * @param {string} input
     * @return {String}
     * @return {null}
     */
    static _getType(input) {
        input = input.toLowerCase()
        let possibleRaids = config.raids
        for(let raid in possibleRaids) {
            if(raid === input) {
                return raid
            } else {
                let alias = possibleRaids[raid].alias
                for(let i = 0; i < alias.length; i++) {
                    if(alias[i] === input)
                        return raid
                }
            }
        }
        return null
    }

    /**
     * @param {String} shortName
     * @return {String}
     */
    static _getRaidLeadName(shortName) {
        return shortName
    }
}

module.exports = RaidFactory
