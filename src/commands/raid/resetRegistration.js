const MessageHandler = require('../../util/messageHandler')

exports.run = async (bot, msg, args) => {
    try {
        if(args.length < 1) {
            msg.reply('Zu wenige Argumente übergeben. Es muss 1 sein!')
            return
        }

        const raidID = parseInt(args[0])
        const raid = await bot.database.getRaidByID(raidID)
        if(!raid) {
            msg.reply('Konnte den Raid nicht finden. Prüfe die Eingabe und versuchs nochmal!')
            return
        }

        raid.member.confirmed.forEach((player) => {
            raid.member.registered.push(player)
        })

        raid.member.confirmed = []

        await bot.database.addOrUpdateRaid(raid)
        MessageHandler.updatePrintedRaid(bot, raid)
        msg.reply(`Alle Bestätigungen wurden für den Raid ${raid.id} zurückgesetzt`)

    } catch(error) {
        if(msg) {
            msg.reply(error.message)
        }
        console.log(`printRaids:\n${error.stack}`)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['reset'],
    permLevel: 3
}

exports.help = {
    name: 'registrierungZurücksetzen',
    description: 'Setzt alle Registrierungen eines Raids zurück',
    usage: 'registrierungZurücksetzen <raidID>'
}
