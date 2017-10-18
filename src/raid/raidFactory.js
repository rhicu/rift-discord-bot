const config = require('../config.json')
const Raid = require('./raidNew')

/** */
class RaidFactory {

    /** */
    constructor() {}

    /**
     * 
     * @param {String} input
     * @param {String} raidLeadName
     * 
     * @return {Raid}
     */
    newRaid(args, raidLeadName) {
        try {
            const type = this._getType(args[0])
            if(!type)
                return null

            const date = this._generateDate(args[1])
            if(date === 'Invalid Date')
                return null

            const start = this._verifyTime(args[2])
            if(!start)
                return null

            const end = this._verifyTime(args[3])
            if(!end)
                return null

            return new Raid(type, date, start, end, raidLeadName)
        } catch(error) {
            console.log(`newRaid: ${error.stack}`)
            return null
        }
    }

    /**
     * 
     * @param {string} input 
     * 
     * @return {String}
     * @return {null}
     */
    _getType(input) {
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
     * 
     * @param {String} dateString 
     * 
     * @return {Date}
     */
    _generateDate(dateString) {
        const dateArray = dateString.split('.')
        return new Date(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`)
    }

    /**
     * 
     * @param {String} timeString 
     */
    _verifyTime(timeString) {
        return timeString
    }
}

module.exports = RaidFactory
