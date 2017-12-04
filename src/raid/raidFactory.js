const config = require('./raidConfig')
const Raid = require('./raid')

/** */
class RaidFactory {

    /** */
    constructor() {}

    /**
     *
     * @param {String[]} args
     * @param {Number} id
     * @param {String} raidLeadName
     *
     * @return {Raid}
     */
    static newRaid(args, id, raidLeadName) {
        try {
            if(args.length < 2)
                return null

            const type = RaidFactory._getType(args[0])
            if(!type)
                return null

            const date = RaidFactory._generateDate(args[1])
            if(date === 'Invalid Date')
                return null

            let start
            let end
            if(args.length < 4) {
                start = RaidFactory._verifyTime(config.defaultStartingTime)
                if(!start)
                    return null

                end = RaidFactory._verifyTime(config.defaultEndingTime)
                if(!end)
                    return null
            } else {
                start = RaidFactory._verifyTime(args[2])
                if(!start)
                    return null

                end = RaidFactory._verifyTime(args[3])
                if(!end)
                    return null
            }

            return new Raid(id, type, date, start, end, raidLeadName, '')
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
     *
     * @param {String} dateString
     *
     * @return {Date}
     */
    static _generateDate(dateString) {
        const dateArray = dateString.split('.')
        return new Date(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`)
    }

    /**
     *
     * @param {String} timeString
     *
     * @return {String}
     */
    static _verifyTime(timeString) {
        return timeString
    }
}

module.exports = RaidFactory
