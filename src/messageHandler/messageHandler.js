const Actions = require('./actions')
const N = '\n'

/** */
class MessageHandler {

    /**
     *
     * @param {Client} bot
     */
    constructor(bot) {
        this.raids = []
        this.bot = bot
        this.commands = new Actions(this.bot, this.raids)
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
                this.commands.register(msg)
                break
            case 'deregister':
                this.commands.deregister(msg)
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
                this.commands.newCharacter(msg)
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
                this.commands.addRaid(msg)
                break
            case 'clearRaidChannel':
                this.commands.clearChannel()
                break
            case 'printRaids':
                this.commands.printRaids(msg)
                break
            case 'register':
                this.commands.register(msg)
                break
            case 'deregister':
                this.commands.deregister(msg)
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
                this.commands.deleteRaid(msg)
                break
            case 'updateRaid':
                this.commands.updateRaid(msg)
                break
            case 'create':
                this.commands.newCharacter(msg)
                break
            case 'confirm':
                this.commands.confirmRegisteredEventMemberForEvent(msg)
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
