const RaidFactory = require('../raid/raidFactory')
const PlayerFactory = require('../user/playerFactory')
const Database = require('../db/dbInteraction')

const N = '\n'

/** */
class MessageHandler {

    /** */
    static init() {
        Database.init()
    }

    /**
     * @param {Message} message
     */
    static createOrUpdatePlayer(message) {
        try {
            const userInput = MessageHandler._beautifyUserInput(message.content)

            // create Raid object
            const newRaid = RaidFactory.createRaidFromUserInput(userInput, message.author.id)

            // check if input was valid
            if(!newRaid) {
                message.reply('Couldn\'t create new character! Please check your input and try again!')
                return
            }

            // check if character already exists and was created by this user
            Database.isEntitledToUpdatePlayer(newRaid)
                .then((result) => {
                    if(result === false) {
                        message.reply('You are not allowed to update this character!')
                    } else {
                        // check if character already exists
                        Database.addOrUpdatePlayer(newRaid)
                            .then((result) => {
                                if(result === true) {
                                    message.reply(`New charackter ${newRaid.ingameName} successfully created!`)
                                } else {
                                    message.reply(`Charackter ${newRaid.ingameName} successfully updated!`)
                                }
                            }).catch((error) => {
                                message.reply(error.message)
                            })
                    }
                }).catch((error) => {
                    message.reply(error.message)
                })
        } catch(error) {
            message.reply(error.message)
        }
    }

    /**
     * @param {Message} message
     */
    static deletePlayer(message) {
        const userInput = MessageHandler._beautifyUserInput(message.content)
        const splittedUserInput = userInput.split(' ').splice(1)

        if(splittedUserInput.length < 1) {
            message.reply('Too few arguments! Check input and try again!')
            return
        }

        const discordID = message.author.id
        const shortName = splittedUserInput[0]

        try {
            Database.deletePlayer(shortName, discordID)
                .then((result) => {
                    if(result) {
                        message.reply(`${shortName} has been deleted successfully!`)
                    } else {
                        message.reply(`${shortName} could\'t be deleted! Is it really your character?`)
                    }
                })
        } catch(error) {
            message.reply(error.message)
        }
    }

    /**
     * @param {Message} message
     */
    static addRaid(message) {
        const userInput = MessageHandler._beautifyUserInput(message.content)
        
    }

    /**
     *
     * @param {Boolean} isOffi
     *
     * @return {String}
     */
    static help(isOffi) {
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
    static hilfe(isOffi) {
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
    static memberCommand(msg) {
        let command = msg.content.split(' ')[0].toLowerCase()
        switch(command) {
            case 'register':
                MessageHandler.register(msg)
                break
            case 'deregister':
                MessageHandler.deregister(msg)
                break
            case 'help':
                msg.reply(MessageHandler.help(false))
                    .catch((error) => console.log(`help: ${error}`))
                break
            case 'hilfe':
                msg.reply(MessageHandler.hilfe(false))
                    .catch((error) => console.log(`hilfe: ${error}`))
                break
            case 'create':
                MessageHandler.createOrUpdatePlayer(msg)
                break
            case 'delete':
                MessageHandler.deletePlayer(msg)
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
    static offiCommand(msg) {
        let command = msg.content.split(' ')[0].toLowerCase()
        switch(command) {
            case 'addraid':
                MessageHandler.addRaid(msg)
                break
            case 'clearraidchannel':
                MessageHandler.clearChannel()
                break
            case 'printraids':
                MessageHandler.printRaids(msg)
                break
            case 'register':
                MessageHandler.register(msg)
                break
            case 'deregister':
                MessageHandler.deregister(msg)
                break
            case 'help':
                msg.reply(MessageHandler.help(true))
                    .catch((error) => console.log(`help: ${error}`))
                break
            case 'hilfe':
                msg.reply(MessageHandler.hilfe(true))
                    .catch((error) => console.log(`hilfe: ${error}`))
                break
            case 'deleteraid':
                MessageHandler.deleteRaid(msg)
                break
            case 'updateraid':
                MessageHandler.updateRaid(msg)
                break
            case 'create':
                MessageHandler.createOrUpdatePlayer(msg)
                break
            case 'confirm':
                MessageHandler.confirmRegisteredEventMemberForEvent(msg)
                break
            case 'delete':
                MessageHandler.deletePlayer(msg)
                break
            default:
                msg.reply(`Unknown command! / Unbekannter Befehl${
                    N}Use 'help' for info! / Nutze 'hilfe' für Informationen`)
                    .catch((error) => console.log(`help: ${error}`))
                break
        }
    }
}

module.exports = MessageHandler
