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
        if(splittedInput.length < 5) {
            return null
        }

        const messageID = ''
        const recurring = false
        const recurringMember = {
            player: []
        }
        const isMainRaid = false
        const shouldBeDisplayed = true
        const member = {
            registered: [],
            confirmed: [],
            deregistered: []
        }

        const type = RaidFactory._getType(splittedInput[0])
        const date = splittedInput[1]
        if(!type || !date) {
            return null
        }

        let raidLead = RaidFactory._getRaidLeadName(splittedInput[2])

        let start
        let end
        switch(splittedInput.length) {
            case 3:
                start = Time.getDateFromGermanDateAndTimeString(date, config.defaultStartingTime)
                end = Time.getDateFromGermanDateAndTimeString(date, config.defaultEndingTime)
                break
            case 5:
                start = Time.getDateFromGermanDateAndTimeString(date, splittedInput[3])
                end = Time.getDateFromGermanDateAndTimeString(date, splittedInput[4])
                break
            default:
                throw new Error('You have to declare either start and end time or none of them!')
        }
        if(!start || !end) {
            return null
        }

        const newRaid = new Raid(type, start, end, raidLead, messageID, member, recurring, recurringMember, isMainRaid, shouldBeDisplayed)
        if(newRaid) {
            return newRaid
        } else {
            return null
        }
    }

    /**
     * @param {Object} dataBaseObject
     * @return {Raid}
     */
    static recreateRaidFromDatabaseObject(dataBaseObject) {
        if(dataBaseObject) {
            const newRaid = new Raid(
                dataBaseObject.type,
                dataBaseObject.start,
                dataBaseObject.end,
                dataBaseObject.raidLead,
                dataBaseObject.messageID,
                dataBaseObject.member,
                dataBaseObject.recurring,
                dataBaseObject.recurringMember,
                dataBaseObject.isMainRaid,
                dataBaseObject.shouldBeDisplayed
            )
            newRaid.id = dataBaseObject.id
            return newRaid
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
                    if(alias[i] === input) {
                        return raid
                    }
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
