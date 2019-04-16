const MessageHandler = require('../../util/messageHandler')
const util = require('../../util/util')

exports.run = async (bot, msg, args) => {
    try {
        if(args.length < 1) {
            msg.reply('Bitte mindestens einen Parameter (Raid ID) übergeben!')
            if (bot.commands.has('help')) {
                bot.commands.get('help').run(bot, msg, 'help', 0)
            }
            return
        }

        const raidID = parseInt(args[0])
        const userID = msg.author.id

        const raid = await bot.database.getRaidByID(raidID)
        if(!raid) {
            msg.reply('Raid konnte nicht gefunden werden. Prüfe deine Eingabe und versuchs nochmal!')
            return
        }

        const playerNames = util.getPlayerNamesFromJSONArray(raid.member.registered).concat(util.getPlayerNamesFromJSONArray(raid.member.deregistered))
        let player = await bot.database.getPlayerByNameArrayAndDiscordID(playerNames, userID)
        if(!player && args.length === 2) {
            player = await bot.database.getPlayerByShortNameAndDiscordID(args[1], userID)
        }
        if(!player) {
            msg.reply('Spieler konnte nicht gefunden werden. Prüfe deine Eingabe und versuchs nochmal!')
            return
        }

        const isDeregistered = raid.member.deregistered.filter((member) => {
            return member.name === player.ingameName
        })
        if(isDeregistered.length !== 0) {
            msg.reply('Du bist bereits Abgemeldet!')
            return
        }

        const isRegistered = raid.member.registered.filter((member) => {
            return member.name === player.ingameName
        })
        if(isRegistered.length !== 0) {
            raid.member.registered = raid.member.registered.filter((element) => {
                return element.name !== player.ingameName
            })
        }

        const isConfirmed = raid.member.confirmed.filter((member) => {
            return member.name === player.ingameName
        })
        if(isConfirmed.length !== 0) {
            raid.member.confirmed = raid.member.confirmed.filter((element) => {
                return element.name !== player.ingameName
            })
        }

        const playerData = {
            name: player.ingameName,
            data: `${util.makeFirstLetterOfStringUppercase(player.riftClass)} - ${util.formatPlayerName(player.ingameName)} (${util.rolesToString(player.roles)})`
        }
        raid.member.deregistered.push(playerData)

        await bot.database.addOrUpdateRaid(raid)
        MessageHandler.updatePrintedRaid(bot, raid)
        msg.reply(`Du bist erfolgreich vom Raid ${raid.id} abgemeldet!`)
    } catch(error) {
        msg.reply(error.message)
        console.log(`deregister:\n${error.stack}`)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['unregister', 'deregister'],
    permLevel: 0
}

exports.help = {
    name: 'abmelden',
    description: 'Von einem Raid abmelden',
    usage: 'abmelden <raidID>'
}
