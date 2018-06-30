const MessageHandler = require('../util/messageHandler')
const util = require('../util/util')

exports.run = async (bot, msg, args) => {
    try {
        if(args.length !== 2) {
            msg.reply('Zu wenige Argumente eingegeben!')
            if (bot.commands.has('help')) {
                bot.commands.get('help').run(bot, msg, 'help', 0)
            }
            return
        }

        const raidID = parseInt(args[0])
        const shortName = args[1]
        const userID = msg.author.id

        const raid = await bot.database.getRaidByID(raidID)
        if(!raid) {
            msg.reply('Der Raid konnte nicht gefunden werden. Bitte Eingabe überprüfen und nochmal versuchen!')
            return
        }

        const player = await bot.database.getPlayerByShortNameAndDiscordID(shortName, userID)
        if(!player) {
            msg.reply('Spieler konnte nicht gefunden werden. Wurde diser bereits erstellt? Bitte Eingabe überprüfen und nochmal versuchen!')
            return
        }

        const playerNames = util.getPlayerNamesFromJSONArray(raid.member.registered).concat(util.getPlayerNamesFromJSONArray(raid.member.confirmed))
        if(playerNames.length) {
            const registeredPlayer = await bot.database.getPlayerByNameArrayAndDiscordID(playerNames, userID)
            if(registeredPlayer) {
                msg.reply('Du bist für diesen Raid bereits registriert!')
                return
            }
        }

        const playerData = {
            name: player.ingameName,
            data: `${util.makeFirstLetterOfStringUppercase(player.riftClass)} - ${util.formatPlayerName(player.ingameName)} (${util.rolesToString(player.roles)})`
        }
        raid.member.registered.push(playerData)

        const isAlreadyDeregistered = raid.member.deregistered.filter((member) => {
            return member.name === player.ingameName
        })
        if(isAlreadyDeregistered) {
            raid.member.deregistered = raid.member.deregistered.filter((element) => {
                return element.name !== player.ingameName
            })
        }

        await bot.database.addOrUpdateRaid(raid)
        MessageHandler.updatePrintedRaid(bot, raid)
        msg.reply(`Du bist nun erfolgreich registriert für den Raid ${raid.id}`)
    } catch(error) {
        msg.reply(error.message)
        console.log(`register: ${error}`)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
}

exports.help = {
    name: 'register',
    description: 'Register to raid. What did you expect?',
    usage: 'register <raidID> <shortName>'
}
