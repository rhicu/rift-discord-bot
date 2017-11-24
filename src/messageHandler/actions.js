const Player = require('./player')
const util = require('./util')
const config = require('./config.json')
const RaidFactory = require('./raid/raidFactory')
const db = require('../db/mongo')

/** */
class Actions {

    /**
     *
     * @param {Raid[]} raids
     * @param {Client} bot
     */
    constructor(raids, bot) {
        this.raids = raids
        this.bot = bot
        this.raidFactory = new RaidFactory()
    }

    /**
     *
     * @param {Message} msg
     */
    static addRaid(msg) {
        // check number of arguments
        const message = msg.content.split(' ')
        if(!(message.length === 3 || message.length === 5)) {
            msg.reply('Invalid number of Arguments! Please verify your input!')
            return
        }

        try {
            // change raid id for next creation persistently
            const nextRaidID = db.getNextRaidID()
            // create raid
            message.splice(0, 1)
            const newRaid = this.raidFactory.newRaid(message, nextRaidID, 'icke')

            if(newRaid) {
                // add raid to array and save it in database
                util.pushRaidToArraySortedByDate(this.raids, newRaid)
                db.addNewRaid(newRaid)

                // display new raid
                this.newPrintRaids()
                msg.reply(`New "${config.raids[newRaid.type].name}" raid created`)
            } else {
                msg.reply('Couldn\'t create raid because of missing data. Please check ur input!')
            }
        } catch(error) {
            console.log(`addRaid: ${error}`)
            msg.reply('Couldn\'t create raid')
        }
    }
}

module.exports = Actions
