const Player = require('../player')
const util = require('../util')
const config = require('../config.json')
const RaidFactory = require('../raid/raidFactory')
const db = require('../db/mongo')

/** */
class Actions {

    /**
     *
     * @param {Client} bot
     */
    constructor(bot) {
        this.raids = []
        this.bot = bot
        db.getAllRaids()
            .then((raidArrayFromDatabase) => {
                raidArrayFromDatabase.forEach((raid) => {
                    util.pushRaidToArraySortedByDate(this.raids, raid)
                })
            }).then(() => {
                this.printRaids()
            })
    }

    // raid stuff - adding, editing, printing, deleting

    /**
     *
     * @param {Message} msg
     */
    addRaid(msg) {
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
                    const newRaid = RaidFactory.newRaid(message, nextRaidID, 'any offi')

                    if(newRaid) {
                        // add raid to array and save it in database
                        util.pushRaidToArraySortedByDate(this.raids, newRaid)
                        db.addRaid(newRaid)

                        // display new raid
                        this.printRaids()
                        msg.reply(`New "${newRaid.name}" raid created`)
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
    printRaids() {
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
    updateRaid(msg) {
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
                        .then(() => {
                            this._updateSingleRaidOutput(this.raids[i].id)
                        })
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
     * @param {Message} msg
     */
    deleteRaid(msg) {
        try {
            const message = msg.content.split(' ')
            if(message.length != 2) {
                msg.reply('Invalid number of Arguments! Please verify your input!')
                return
            }

            const channel = this._getChannel()
            const raidID = parseInt(message[1])

            const index = this.raids.findIndex((r) => r.id === raidID)
            if(index === -1) {
                msg.reply('Couldn\'t find the raid you wanted to delete!')
            } else {
                const raid = this.raids[index]
                if(raid.messageID !== '') {
                    channel.fetchMessage(raid.messageID)
                        .then((message) => message.delete())
                        .catch((error) => console.log(`deleteRaid: ${error}`))
                } else {
                    console.log('deleteRaid: Deleted raid without message ID which should never happen!')
                }
                this.raids.splice(index, 1)

                // delete from db
                db.deleteRaid(raid.id)
                // this.db.run(`DELETE FROM registered WHERE raidID = ${raid.id}`)
                // this.db.run(`DELETE FROM confirmed WHERE raidID = ${raid.id}`)
                msg.reply(`You successfully deleted raid ${raid.name} on ${raid.date}!`)
            }
        } catch(error) {
            console.log(`deleteRaid: ${error}`)
            msg.reply(`something bad happened :(`)
        }
    }

    /**
     *
     * @param {Number} raidID
     */
    _updateSingleRaidOutput(raidID) {
        // get raid
        db.getRaid(raidID)
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

    // Player Stuff - creating, updating

    /**
     *
     * @param {Message} msg
     */
    newCharacter(msg) {
        const message = msg.content.split(' ')
        if(message.length != 5) {
            msg.reply('Invalid number of Arguments! Please verify your input!')
            return
        }

        try {
            let newPlayer = new Player(msg.author.id, message[1], message[2], message[3], message[4])
            if(newPlayer) {
                db.createPlayer()
            } else {
                msg.reply('Couldn\'t create character')
            }
        } catch(error) {
            console.log(`newCharacter: ${error}`)
            msg.reply('Something bad happened :(')
        }
    }

    // register, deregister, confirm

    /**
     *
     * @param {Message} msg
     */
    register(msg) {
        try {
            const message = msg.content.split(' ')
            if(message.length != 3) {
                msg.reply('Invalid number of Arguments! Please verify your input!')
                return
            }

            const newPlayer = db.getPlayer(msg.author.id, message[2])
            if(!newPlayer) {
                msg.reply(`No characters created yet or no character of yours with short name ${message[2]} found!`)
                return
            }

            const raidID = parseInt(message[1])

            const raidInArray = this.raids
                .filter((r) => r.id === raidID)
            if(raidInArray.length === 0) {
                msg.reply('Couldn\'t find the raid you wanted to get registered to!')
            } else if(raidInArray[0].registeredPlayer.find((p) => p.id === newPlayer.id)) {
                msg.reply('You are already registered for this raid!')
            } else if(raidInArray[0].confirmedPlayer.find((p) => p.id === newPlayer.id)) {
                msg.reply('You are already confirmed for this raid!')
            } else {
                raidInArray[0].registeredPlayer.push(newPlayer)
                db.updateRaid(raidInArray[0])
                    .then(() => {
                        this._updateSingleRaidOutput(raidID)
                    })
                msg.reply(`You are now registered for raid "${raidInArray[0].name}" at "${raidInArray[0].date}"! Please be there in time!`)
            }
        } catch(error) {
            console.log(`register: ${error}`)
            msg.reply('something bad happened :(')
        }
    }

    /**
     *
     * @param {Message} msg
     */
    deregister(msg) {
        try {
            const message = msg.content.split(' ')
            if(message.length != 2) {
                msg.reply('Invalid number of Arguments! Please verify your input!')
                return
            }

            const raidID = parseInt(message[1])
            const playerID = msg.author.id

            const raid = this.raids
                .filter((r) => r.id === raidID)
            if(raid.length === 0) {
                msg.reply('Couldn\'t find the raid you wanted to get deregistered from!')
            } else if(raid[0].registeredPlayer.find((p) => p.id === playerID)) {
                const index = raid[0].registeredPlayer.findIndex((p) => p.id === playerID)
                raid[0].registeredPlayer.splice(index, 1)
                db.updateRaid(raid[0])
                    .then(() => {
                        this._updateSingleRaidOutput(raidID)
                    })
                msg.reply(`You are now deregistered from raid "${raid[0].name}" at "${raid[0].date}"!`)
            } else {
                msg.reply('Couldn\'t deregister you from raid! Maybe the raid does not esist?')
            }
        } catch(error) {
            console.log(`deregister: ${error}`)
            msg.reply('something bad happened :(')
        }
    }

    /**
     *
     * @param {Message} msg
     */
    confirmRegisteredEventMemberForEvent(msg) {
        try {
            const message = msg.content.split(' ')
            if(message.length < 3) {
                msg.reply('Invalid number of Arguments! Please verify your input!')
                return
            }

            const raidID = parseInt(message[1])
            const raid = this.raids.find((r) => r.id === raidID)
            let playerNumbersToConfirm = message
            playerNumbersToConfirm.splice(0, 2)
            let numberOfSuccessfulConfirmations = 0
            let playerToDeregister = []

            if(!raid) {
                msg.reply('Couldn\'t find raid! Please check your input!')
            } else {
                playerNumbersToConfirm.forEach((number) => {
                    const index = parseInt(number) - 1
                    if(index < raid.registeredPlayer.length) {
                        const player = raid.registeredPlayer[index]
                        raid.confirmedPlayer.push(player)
                        playerToDeregister.push(player)
                        numberOfSuccessfulConfirmations++
                    }
                })
                playerToDeregister.forEach((player) => {
                    const index = raid.registeredPlayer.findIndex((p) => {
                        p === player
                    })
                    raid.registeredPlayer.splice(index, 1)
                })
                db.updateRaid(raid)
                    .then(() => {
                        this._updateSingleRaidOutput(raidID)
                    })
                msg.reply(`Confirmed ${numberOfSuccessfulConfirmations} player(s) for raid '${raid.name}' with ID '${raid.id}'`)
            }
        } catch(error) {
            console.log(`confirm: ${error}`)
        }
    }
}

module.exports = Actions
