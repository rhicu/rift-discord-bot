const Discord = require('discord.js')
const config = require('./config.json')
const Raid = require('./raid/raid')
const Player = require('./player')
const util = require('./util')
const RaidFactory = require('./raid/raidFactory')
const N = '\n'

// const communicationPrefix = config.communicationPrefix

/**
 * 
 */
class MessageHandler {

    /**
     * 
     * @param {Client} bot 
     * @param {sqlite} db
     * @param {sqlite} newDB 
     */
    constructor(bot, db, newDB) {
        this.raids = []
        this.bot = bot
        this.db = db
        this.newDB = newDB
        this.raidFactory = new RaidFactory();
        (async () => {
            try {
                const rowsOfRaids = await this.db.all(`SELECT * FROM raids`)
                    .catch((error) => {
                        console.log(error)
                        this.db.run('CREATE TABLE IF NOT EXISTS raids (raidID Integer, name TEXT, type TEXT, day TEXT, date TEXT)')
                    })
                if (rowsOfRaids && rowsOfRaids.length !== 0) {
                    for (const raidInstance of rowsOfRaids) {
                        let newRaid = new Raid(raidInstance.type, raidInstance.date)
                        newRaid.id = raidInstance.raidID
                        newRaid.day = raidInstance.day
                        util.pushRaidToArraySortedByDate(this.raids, newRaid)

                        // add all registered players from this.db to runtime objects
                        const rowsOfRegisteredPlayer = await this.db.all(`Select * FROM registered WHERE raidID = ${raidInstance.raidID}`)
                            .catch((error) => {
                                console.log(error)
                                this.db.run('CREATE TABLE IF NOT EXISTS registered (raidID INTEGER, userID TEXT, shortName TEXT)')
                            })
                        if(rowsOfRegisteredPlayer && rowsOfRegisteredPlayer.length !== 0) {
                            for (const player of rowsOfRegisteredPlayer) {
                                const newPlayer = await this.createPlayerFromDatabase(player.userID, player.shortName)
                                newRaid.registeredPlayer.push(newPlayer)
                            }
                        }

                        // add all confirmed players form this.db to runtime objects
                        const rowsOfConfirmedPlayer = await this.db.all(`Select * FROM confirmed WHERE raidID = ${raidInstance.raidID}`)
                            .catch((error) => {
                                console.log(error)
                                this.db.run('CREATE TABLE IF NOT EXISTS confirmed (raidID INTEGER, userID TEXT, shortName TEXT)')
                            })
                        if(rowsOfConfirmedPlayer && rowsOfConfirmedPlayer.length !== 0) {
                            for (const player of rowsOfConfirmedPlayer) {
                                const newPlayer = await this.createPlayerFromDatabase(player.userID, player.shortName)
                                newRaid.confirmedPlayer.push(newPlayer)
                            }
                        }
                    }
                }
                this.actualRaidID = 1000
                await this.db.get(`SELECT * FROM data WHERE name = "actualRaidID"`)
                    .then((row) => {
                        this.actualRaidID = row.intValue
                    })
                    .catch((error) => {
                        console.log(error)
                        this.db.run('CREATE TABLE IF NOT EXISTS data (name TEXT, intValue INTEGER, stringValue TEXT)').then(() => {
                            this.db.run('INSERT INTO data (name, intValue, stringValue) VALUES (?, ?, ?)', ['actualRaidID', 1000, ''])
                        })
                    })
                this.printRaids()
            } catch(error) {
                console.log(`constructor: ${error}`)
                throw new Error('Something went badly wrong!')
            }
        })()
    }

    /**
     * 
     * @param {Message} msg 
     */
    addRaid(msg) {
        const message = msg.content.split(' ')
        if(message.length != 4) {
            msg.reply('Invalid number of Arguments! Please verify your input!')
            return
        }
        try {
            let type
            switch(message[1]) {
                case 'irotp':
                    type = 'irotp'
                    break
                case 'td':
                    type = 'td'
                    break
                default:
                    msg.reply('unknown raid, use \'irotp\' or \'td\'')
                    return
            }
            const newRaid = new Raid(type, util.getDate(message[3]))
            newRaid.day = util.getDay(message[2])
            newRaid.id = this.actualRaidID + 1

            if(newRaid.isValid()) {
                util.pushRaidToArraySortedByDate(this.raids, newRaid)
                this.actualRaidID++;
                (async () => {
                    await this.db.run('INSERT INTO raids (raidID, name, type, day, date) VALUES (?, ?, ?, ?, ?)', [newRaid.id, newRaid.name, newRaid.type, newRaid.day, newRaid.date])
                        .catch((error) => {
                            console.log(error)
                            this.db.run('CREATE TABLE IF NOT EXISTS raids (raidID INTEGER, name TEXT, type TEXT, day TEXT, date TEXT)').then(() => {
                                this.db.run('INSERT INTO raids (raidID, name, type, day, date) VALUES (?, ?, ?, ?, ?)', [newRaid.id, newRaid.name, newRaid.type, newRaid.day, newRaid.date])
                            })
                        })
                    await this.db.run(`UPDATE data SET intValue = ${this.actualRaidID} WHERE name = "actualRaidID"`)
                })()
                msg.reply(`raid "${newRaid.name}" added`)
                this.printRaids()
            } else {
                msg.reply(`Couldn't create raid because of missing data. Please try again!`)
            }
        } catch(error) {
            console.log(`addRaid: ${error}`)
            msg.reply('Couldn\'t create raid')
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

            const channel = this.bot.guilds.find('id', config.serverID).channels.find('id', config.raidPlannerChannelID)

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
                }
                this.raids.splice(index, 1)
                this.db.run(`DELETE FROM raids WHERE raidID = ${raid.id}`)
                this.db.run(`DELETE FROM registered WHERE raidID = ${raid.id}`)
                this.db.run(`DELETE FROM confirmed WHERE raidID = ${raid.id}`)
                msg.reply(`You successfully deleted raid ${raid.name} on ${raid.day}!`)
            }
        } catch(error) {
            console.log(`deleteRaid: ${error}`)
            msg.reply(`something bad happened :(`)
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
                    this.updatePrintedRaid(this.raids[i])
                    msg.reply(`Raid ${this.raids[i].name} on ${this.raids[i].date} is updated!`)
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
     * @param {Raid} raidInstance 
     * 
     * @return {Boolean}
     */
    updatePrintedRaid(raidInstance) {
        try {
            const channel = this.bot.guilds.find('id', config.serverID).channels.find('id', config.raidPlannerChannelID)

            if(raidInstance.messageID !== '') {
                let embed = new Discord.RichEmbed()
                    .addField(raidInstance.name, raidInstance.generateRaidOutput())
                    .setColor(raidInstance.embedColor)
                    .setThumbnail(raidInstance.imgURL)
                channel.fetchMessage(raidInstance.messageID)
                    .then((message) => message.edit({embed}))
                    .catch((error) => console.log(`updatePrintedRaid/fetchMessage: ${error}`))
            }
            return false
        } catch(error) {
            console.log(`updatePrintedRaid: ${error}`)
            return true
        }
    }

    /**
     * 
     * @param {String} playerID
     * @param {String} shortName 
     * 
     * @return {Player}
     * @return {null}
     */
    createPlayerFromDatabase(playerID, shortName) {
        return this.db.all(`SELECT * FROM characters WHERE userID = "${playerID}"`)
            .then((rows) => {
                if (!rows) {
                    return null
                } else {
                    const row = rows.filter((row) => row.shortName === shortName)
                    if(row.length === 1) {
                        return new Player(row[0].userID, row[0].name, row[0].riftClass, row[0].roles, row[0].shortName)
                    } else {
                        return null
                    }
                }
            }).catch((error) => {
                console.log(error)
            })
    }

    /**
     * 
     * @param {Message} msg 
     */
    register(msg) {
        (async () => {
            try {
                const message = msg.content.split(' ')
                if(message.length != 3) {
                    msg.reply('Invalid number of Arguments! Please verify your input!')
                    return
                }

                const newPlayer = await this.createPlayerFromDatabase(msg.author.id, message[2])
                if(!newPlayer) {
                    msg.reply(`No characters created yet or no character of yours with short name ${message[2]} found!`)
                    return
                }

                const raidID = parseInt(message[1])

                const raid = this.raids
                    .filter((r) => r.id === raidID)
                if(raid.length === 0) {
                    msg.reply('Couldn\'t find the raid you wanted to get registered to!')
                } else if(raid[0].registeredPlayer.find((p) => p.id === newPlayer.id)) {
                    msg.reply('You are already registered for this raid!')
                } else if(raid[0].confirmedPlayer.find((p) => p.id === newPlayer.id)) {
                    msg.reply('You are already confirmed for this raid!')
                } else {
                    this.db.get(`Select * FROM registered WHERE raidID = ${raid[0].id} AND userID = "${newPlayer.id}"`)
                        .then((row) => {
                            if(!row) {
                                this.db.run('INSERT INTO registered (raidID, userID, shortName) VALUES (?, ?, ?)', [raid[0].id, newPlayer.id, newPlayer.shortName])
                            }
                        })
                        .catch((error) => {
                            console.log(error)
                            this.db.run('CREATE TABLE IF NOT EXISTS registered (raidID INTEGER, userID TEXT, shortName TEXT)').then(() => {
                                this.db.run('INSERT INTO registered (raidID, userID, shortName) VALUES (?, ?, ?)', [raid[0].id, newPlayer.id, newPlayer.shortName])
                            })
                        })
                    raid[0].registeredPlayer.push(newPlayer)
                    this.updatePrintedRaid(raid[0])
                    msg.reply(`You are now registered for raid "${raid[0].name}" at "${raid[0].day}"! Please be there in time!`)
                }
            } catch(error) {
                console.log(`register: ${error}`)
                msg.reply('something bad happened :(')
            }
        })()
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
                this.db.run(`DELETE FROM registered WHERE raidID = "${raid[0].id}" AND userID = "${playerID}"`)
                const index = raid[0].registeredPlayer.findIndex((p) => p.id === playerID)
                raid[0].registeredPlayer.splice(index, 1)
                this.updatePrintedRaid(raid[0])
                msg.reply(`You are now deregistered from raid "${raid[0].name}" on "${raid[0].day}"!`)
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
     */
    clearChannel() {
        try {
            const channel = this.bot.guilds.find('id', config.serverID).channels.find('id', config.raidPlannerChannelID)
            channel.fetchMessages()
                .then((messages) => {
                    messages.deleteAll()
                })
        } catch(error) {
            console.log(`clearChannel: ${error}`)
        }
    }

    /**
     * 
     */
    printRaids() {
        try {
            const channel = this.bot.guilds.find('id', config.serverID).channels.find('id', config.raidPlannerChannelID)
            this.clearChannel();

            (async () => {
                for(let i = 0; i < this.raids.length; i++) {
                    let pos = i
                    let embed = new Discord.RichEmbed()
                        .addField(this.raids[pos].name, this.raids[pos].generateRaidOutput())
                        .setColor(this.raids[pos].embedColor)
                        .setThumbnail(this.raids[pos].imgURL)
                    await channel.send({embed})
                        .then((message) => {
                            this.raids[pos].messageID = message.id
                        })
                        .catch((error) => console.log(`printRaids/sending message: ${error}`))
                }
            })()
        } catch(error) {
            console.log(`printRaids: ${error}`)
        }
    }

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
            this.db.get(`SELECT * FROM characters WHERE name = "${message[1]}"`).then((row) => {
                if (!row) {
                    this.db.run('INSERT INTO characters (name, userID, riftClass, roles, shortName) VALUES (?, ?, ?, ?, ?)', [message[1], msg.author.id, message [2], message[3], message[4]])
                        .then(() => msg.reply('Character created'))
                } else {
                    this.db.run(`UPDATE characters SET riftClass = "${message[2]}", roles = "${message[3]}", shortName = "${message[4]}" WHERE name = "${message[1]}"`)
                        .then(() => msg.reply('Character updated'))
                }
            }).catch((error) => {
                console.log(`newCharacter/ get player from this.db: ${error}`)
                this.db.run('CREATE TABLE IF NOT EXISTS characters (name TEXT, userID TEXT, riftClass TEXT, roles TEXT, shortName TEXT)').then(() => {
                    this.db.run('INSERT INTO characters (name, userID, riftClass, roles, shortName) VALUES (?, ?, ?, ?, ?)', [message[1], msg.author.id, message [2], message[3], message[4]])
                        .then(() => msg.reply('Character created'))
                })
            })
        } catch(error) {
            console.log(`newCharacter: ${error}`)
            msg.reply('Unable to handle database')
            return
        }
    }

    /**
     * 
     * @param {String} raidID 
     * @param {Player} player 
     */
    databaseConfirm(raidID, player) {
        this.databaseDeregister(raidID, player)
        this.db.run('INSERT INTO confirmed (raidID, userID, shortName) VALUES (?, ?, ?)', [raidID, player.id, player.shortName])
            .catch((error) => {
                console.log(`databaseConfirm: ${error}`)
                this.db.run('CREATE TABLE IF NOT EXISTS confirmed (raidID INTEGER, userID TEXT, shortName TEXT)')
                    .then(() => {
                        this.db.run('INSERT INTO confirmed (raidID, userID, shortName) VALUES (?, ?, ?)', [raidID, player.id, player.shortName])
                    })
            })
    }

    /**
     * 
     * @param {String} raidID 
     * @param {Player} player 
     */
    databaseDeregister(raidID, player) {
        this.db.run(`DELETE FROM registered WHERE raidID = ${raidID} AND userID = "${player.id}"`)
            .catch((error) => {
                console.log(`databaseDeregister: ${error}`)
                this.db.run('CREATE TABLE IF NOT EXISTS registered (raidID INTEGER, userID TEXT, shortName TEXT)')
            })
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
                        this.databaseConfirm(raidID, player)
                    }
                })
                playerToDeregister.forEach((player) => {
                    const index = raid.registeredPlayer.findIndex((p) => {
                        p === player
                    })
                    raid.registeredPlayer.splice(index, 1)
                })
                this.updatePrintedRaid(raid)
                msg.reply(`Confirmed ${numberOfSuccessfulConfirmations} player(s) for raid '${raid.name}' with ID '${raid.id}'`)
            }
        } catch(error) {
            console.log(`confirm: ${error}`)
        }
    }

    /**
     * 
     * @param {Boolean} isOffi 
     * 
     * @return {String}
     */
    help(isOffi) {
        let string = 'usage:\n\n'
        string = `${string}help - show this message${
            N}${
            N}1. Create your Character: (You have to do this once for every raiding charakter.)${
            N}   create <name@shard> <class> <roles> <shortName>${
            N}   e.g.: 'create Paxie@Brutwacht Kleriker Tank,DD,Heal,Support Pax'${
            N}${
            N}2. Register your character for incoming raid:${
            N}   register <raidID> <shortName>${
            N}   e.g. 'register 1001 Pax'${
            N}${
            N}3. Deregister your character for incoming raid:${
            N}   deregister <raidID>${
            N}   e.g. 'deregister 1003'`

        if (isOffi) {
            string = `${string}${
                N}${
                N}Admin Settings:${
                N}${
                N}Create a new raid instance:${
                N}addRaid <irotp / td> <day> <date>${
                N}e.g. 'addRaid td Wednesday 01.01.1970'${
                N}${
                N}updates an existing raid instance: (one property per command)${
                N}updateRaid <raidID> <day / date / start / end / invite / raidlead> <data>${
                N}e.g. 'updateRaid 1000 start 18:00'${
                N}${
                N}deletes a raid instance:${
                N}deleteRaid <raidID>${
                N}e.g. 'deleteRaid 1000'${
                N}${
                N}confirm players for raid:${
                N}confirm <raidID> <number of player in registered list> <2nd player> <3rd player> ...${
                N}e.g. 'confirm 1000 8 4 12'${
                N}${
                N}Delete all messages in raid planner channel and print all active raids again:${
                N}printRaids${
                N}${
                N}Deletes all messages in raid planner channel${
                N}clearRaidChannel`
        }
        return string
    }

    /**
     * 
     * @param {Boolean} isOffi 
     * 
     * @return {String}
     */
    hilfe(isOffi) {
        let string = 'Benutzung:\n\n'
        string = `${string}hilfe - zeigt Dir diese Hilfe an${
            N}${
            N}1. Erstelle deinen Charakter (Dies musst du nur EINMAL machen.)${
            N}   create <Name@Server> <Klasse> <Rollen> <Dein Kürzel>${
            N}   z.B.: 'create Paxie@Brutwacht Kleriker Tank,DD,Heal,Support Pax'${
            N}${
            N}2. Melde Dich für kommende Raids an:${
            N}   register <raidID> <DeinKürzel>${
            N}   z.B. 'register 1001 Pax'${
            N}${
            N}3. Abmelden von einem Raid:${
            N}   deregister <raidID>${
            N}   z.B.: 'deregister 1003'`
        return string
    }

    /**
     * 
     * @param {Message} msg 
     */
    memberCommand(msg) {
        let command = msg.content.split(' ')[0]
        switch(command) {
            case 'register':
                this.register(msg)
                break
            case 'deregister':
                this.deregister(msg)
                break
            case 'help':
                msg.reply(this.help(false))
                    .catch((error) => console.log(`help: ${error}`))
                break
            case 'hilfe':
                msg.reply(this.hilfe(false))
                    .catch((error) => console.log(`hilfe: ${error}`))
                break
            case 'create':
                this.newCharacter(msg)
                break
            default:
                msg.reply(`Unknown command! / Unbekannter Befehl${
                    N}Use 'help' for info! / Nutze 'hilfe' für Informationen`)
                    .catch((error) => console.log(`help: ${error}`))
                break
        }
    }

    /**
     * 
     * @param {Message} msg 
     */
    offiCommand(msg) {
        let command = msg.content.split(' ')[0]
        switch(command) {
            case 'addRaid':
                this.addRaid(msg)
                break
            case 'clearRaidChannel':
                this.clearChannel()
                break
            case 'printRaids':
                this.printRaids(msg)
                break
            case 'register':
                this.register(msg)
                break
            case 'deregister':
                this.deregister(msg)
                break
            case 'help':
                msg.reply(this.help(true))
                    .catch((error) => console.log(`help: ${error}`))
                break
            case 'hilfe':
                msg.reply(this.hilfe(true))
                    .catch((error) => console.log(`hilfe: ${error}`))
                break
            case 'deleteRaid':
                this.deleteRaid(msg)
                break
            case 'updateRaid':
                this.updateRaid(msg)
                break
            case 'create':
                this.newCharacter(msg)
                break
            case 'confirm':
                this.confirmRegisteredEventMemberForEvent(msg)
                break
            default:
                msg.reply(`Unknown command! / Unbekannter Befehl${
                    N}Use 'help' for info! / Nutze 'hilfe' für Informationen`)
                    .catch((error) => console.log(`help: ${error}`))
                break
        }
    }

    /**
     * 
     * @param {Message} msg 
     */
    newAddRaid(msg) {
        const message = msg.content.split(' ')
        if(message.length != 4) {
            msg.reply('Invalid number of Arguments! Please verify your input!')
            return
        }
        try {
            const newRaid = this.raidFactory.newRaid(message.splice(1))

            if(newRaid.isValid()) {
                util.pushRaidToArraySortedByDate(this.raids, newRaid)
                this.actualRaidID++;
                (async () => {
                    await this.db.run('INSERT INTO raids (raidID, name, type, day, date) VALUES (?, ?, ?, ?, ?)', [newRaid.id, newRaid.name, newRaid.type, newRaid.day, newRaid.date])
                        .catch((error) => {
                            console.log(error)
                            this.db.run('CREATE TABLE IF NOT EXISTS raids (raidID INTEGER, name TEXT, type TEXT, day TEXT, date TEXT)').then(() => {
                                this.db.run('INSERT INTO raids (raidID, name, type, day, date) VALUES (?, ?, ?, ?, ?)', [newRaid.id, newRaid.name, newRaid.type, newRaid.day, newRaid.date])
                            })
                        })
                    await this.db.run(`UPDATE data SET intValue = ${this.actualRaidID} WHERE name = "actualRaidID"`)
                })()
                msg.reply(`raid "${newRaid.name}" added`)
                this.printRaids()
            } else {
                msg.reply(`Couldn't create raid because of missing data. Please try again!`)
            }
        } catch(error) {
            console.log(`addRaid: ${error}`)
            msg.reply('Couldn\'t create raid')
        }
    }

    /**
     * 
     * @param {Message} msg 
     */
    newDeleteRaid(msg) {
        try {
            const message = msg.content.split(' ')
            if(message.length != 2) {
                msg.reply('Invalid number of Arguments! Please verify your input!')
                return
            }

            const channel = this.bot.guilds.find('id', config.serverID).channels.find('id', config.raidPlannerChannelID)

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
                }
                this.raids.splice(index, 1)
                this.db.run(`DELETE FROM raids WHERE raidID = ${raid.id}`)
                this.db.run(`DELETE FROM registered WHERE raidID = ${raid.id}`)
                this.db.run(`DELETE FROM confirmed WHERE raidID = ${raid.id}`)
                msg.reply(`You successfully deleted raid ${raid.name} on ${raid.day}!`)
            }
        } catch(error) {
            console.log(`deleteRaid: ${error}`)
            msg.reply(`something bad happened :(`)
        }
    }

    /**
     * 
     * @param {Message} msg 
     */
    newUpdateRaid(msg) {
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
                    this.updatePrintedRaid(this.raids[i])
                    msg.reply(`Raid ${this.raids[i].name} on ${this.raids[i].date} is updated!`)
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
     * @param {Raid} raidInstance 
     * 
     * @return {Boolean}
     */
    newUpdatePrintedRaid(raidInstance) {
        try {
            const channel = this.bot.guilds.find('id', config.serverID).channels.find('id', config.raidPlannerChannelID)

            if(raidInstance.messageID !== '') {
                let embed = new Discord.RichEmbed()
                    .addField(raidInstance.name, raidInstance.generateRaidOutput())
                    .setColor(raidInstance.embedColor)
                    .setThumbnail(raidInstance.imgURL)
                channel.fetchMessage(raidInstance.messageID)
                    .then((message) => message.edit({embed}))
                    .catch((error) => console.log(`updatePrintedRaid/fetchMessage: ${error}`))
            }
            return false
        } catch(error) {
            console.log(`updatePrintedRaid: ${error}`)
            return true
        }
    }
}

module.exports = MessageHandler
