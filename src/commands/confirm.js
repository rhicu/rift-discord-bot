const MessageHandler = require('../util/messageHandler')

exports.run = async (bot, msg, args) => {
    try {
        if(args.length < 2) {
            msg.reply('Zu wenige Argumente übergeben. Es müssen mindestens 2 sein!')
            return
        }

        const raidID = parseInt(args[0])
        const raid = await bot.database.getRaidByID(raidID)
        if(!raid) {
            msg.reply('Konnte den Raid nicht finden. Prüfe die Eingabe und versuchs nochmal!')
            return
        }

        let registerIDsToConfirm = []
        for(let index = 1; index < args.length; index++) {
            registerIDsToConfirm.push(parseInt(args[index]))
        }

        registerIDsToConfirm.forEach((index) => {
            if(raid.member.registered[index-1]) {
                const player = raid.member.registered[index-1]
                raid.member.confirmed.push(player)
            }
        })

        registerIDsToConfirm.forEach((index) => {
            if(raid.member.registered[index-1]) {
                const player = raid.member.registered[index-1]
                raid.member.registered = raid.member.registered.filter((registeredPlayer) => {
                    return registeredPlayer !== player
                })
            }
        })

        await bot.database.addOrUpdateRaid(raid)
        MessageHandler.updatePrintedRaid(bot, raid)
        msg.reply(`Alle Spieler, die identifiziert werden konnten, wurden für den Raid ${raid.id} bestätigt`)
    } catch(error) {
        msg.reply(error.message)
        console.log(`confirm:\n${error.stack}`)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['confirm'],
    permLevel: 0
}

exports.help = {
    name: 'bestätigen',
    description: 'Angemeldete Spieler zum Raid bestätigen',
    usage: 'bestätigen <raidID> <Nummer> <Nummer> <Nummer> ...'
}
