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
                .then(() => {
                    // create raid
                    message.splice(0, 1)
                    const newRaid = this.raidFactory.newRaid(message, nextRaidID, 'any offi')

                    if(newRaid) {
                        // add raid to array and save it in database
                        util.pushRaidToArraySortedByDate(this.raids, newRaid)
                        db.addNewRaid(newRaid)

                        // display new raid
                        this.printRaids()
                        msg.reply(`New "${config.raids[newRaid.type].name}" raid created`)
                    } else {
                        msg.reply('Couldn\'t create raid because of missing data. Please check ur input!')
                    }
                })
        } catch(error) {
            console.log(`addRaid: ${error}`)
            msg.reply('Couldn\'t create raid')
        }
    }

    /**
     *
     */
    static printRaids() {
        try {
            const channel = this._getChannel()
            this._clearChannel()

            this.raids.forEach((raid) => {
                let embed = raid.generateEmbed()
                channel.send({embed})
                    .then((message) => {
                        raid.messageID = message.id
                    })
                    .catch((error) => console.log(`printRaids/sending message: ${error}`))
            })
        } catch(error) {
            console.log(`newPrintRaids: ${error.stack}`)
        }
    }

    /**
     *
     * @param {Message} msg
     */
    static updateRaid(msg) {
        try {
            if(msg.content.split(' ').length !== 4) {
                msg.reply('Invalid number of arguments!')
                return
            }
            const id = parseInt(msg.content.split(' ')[1])
            for(let i = 0; i < this.raids.length; i++) {
                if(this.raids[i].id === id) {
                    const option = msg.content.split(' ')[2]
                    const value = msg.content.split(' ')[3]
                    switch(option) {
                        case 'day':
                            this.raids[i].day = value
                            break
                        case 'date':
                            this.raids[i].date = value
                            break
                        case 'start':
                            this.raids[i].start = value
                            break
                        case 'end':
                            this.raids[i].end = value
                            break
                        case 'invite':
                            this.raids[i].invite = value
                            break
                        case 'raidlead':
                            this.raids[i].raidlead = value
                            break
                        default:
                            msg.reply(`'${option}' is not a property which can be updated!`)
                            return
                    }
                    db.updateRaid(this.raids[i])
                    this._updateSingleRaidOutput(this.raids[i].id)
                    msg.reply(`Raid ${this.raids[i].name} on ${this.raids[i].date} has been updated!`)
                    return
                }
            }
            msg.reply('Error while trying to update raid! Maybe the raid does not esist?')
        } catch(error) {
            console.log(`updateRaid: ${error}`)
            msg.reply('something bad happened :(')
        }
    }

    /**
     *
     * @param {Number} raidID
     */
    _updateSingleRaidOutput(raidID) {
        // get raid
        db.getRaid()
            .then((raid) => {
                if (!raid)
                    return
                else {
                    const embed = raid.generateEmbed()
                    this._getChannel().fetchMessage(raid.messageID)
                        .then((message) => message.edit({embed}))
                        .catch((error) => console.log(`updatePrintedRaid/fetchMessage: ${error}`))
                }
            })
    }

    /** */
    _updateAllRaidsOutput() {
        // get all raidIDs
        db.getRaidIDs()
            // update every raid
            .then((raidIDArray) => {
                raidIDArray.forEach((raidID) => {
                    this._updateSingleRaidOutput(raidID)
                })
            })
    }

    /**
     * @return {TextChannel}
     */
    _getChannel() {
        return this.bot.guilds.find('id', config.serverID).channels.find('id', config.raidPlannerChannelID)
    }

    /** */
    _clearChannel() {
        try {
            const channel = this._getChannel()
            channel.fetchMessages()
                .then((messages) => {
                    messages.deleteAll()
                })
        } catch(error) {
            console.log(`clearChannel: ${error}`)
        }
    }
}

module.exports = Actions
