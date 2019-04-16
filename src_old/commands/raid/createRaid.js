const RaidFactory = require('../../raid/raidFactory')
const MessageHandler = require('../../util/messageHandler')

exports.run = (bot, msg, args) => {
    try {
        const newRaid = RaidFactory.createRaidFromUserInput(args)

        if(!newRaid) {
            msg.reply('Raid konnte nicht erstellt werden. Prüfe deine Eingabe und versuchs nochmal!')
            if (bot.commands.has('help')) {
                bot.commands.get('help').run(bot, msg, 'help', 0)
            }
            return
        }

        bot.database.addOrUpdateRaid(newRaid)
            .then((result) => {
                if(result) {
                    MessageHandler.updatePrintedRaids(bot)
                    msg.reply(`Ein ${newRaid.type} Raid am ${newRaid.start} wurde erfolgreich erstellt!`)
                } else {
                    msg.reply('Konnte den Raid nicht in der Datenbank anlegen. Bitte nochmal versuchen!')
                }
            }).catch((error) => {
                msg.reply(error.message)
                console.log(`createRaid:\n${error.stack}`)
            })
    } catch(error) {
        msg.reply(error.message)
        console.log(`createRaid:\n${error.stack}`)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['add', 'addRaid', 'createRaid', 'hinzufügen'],
    permLevel: 3
}

exports.help = {
    name: 'raidErstellen',
    description: 'Erstellt einen neuen Raid',
    usage: 'raidErstellen <Typ> <Datum> <Raidlead> [<Startzeit> <Endzeit>]'
}
