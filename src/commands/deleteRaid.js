const MessageHandler = require('../util/messageHandler')

exports.run = (bot, msg, args) => {
    try {
        if(args.length !== 1) {
            msg.reply('Bitte nur genau einen Parameter übergeben!')
            return
        }

        const raidID = parseInt(args[0])

        bot.database.deleteRaid(raidID)
            .then((result) => {
                if(result) {
                    msg.reply('Raid erfolgreich gelöscht!')
                    MessageHandler.updatePrintedRaids(bot)
                } else {
                    msg.reply('Raid konnte nicht gelöscht werden. Stimmt die ID?')
                }
            })
    } catch(error) {
        msg.reply(error.message)
        msg.reply(`deleteRaid:\n${error.message}`)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['delete', 'deleteRaid', 'löschen'],
    permLevel: 3
}

exports.help = {
    name: 'raidLöschen',
    description: 'Löscht einen Raid',
    usage: 'raidLöschen <raidID>'
}
