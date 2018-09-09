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

        let confirmedPlayerToDeconfirm = []
        for(let index = 1; index < args.length; index++) {
            const id = parseInt(args[index])
            if(raid.member.confirmed[id-1]) {
                const player = raid.member.confirmed[id-1]
                confirmedPlayerToDeconfirm.push(player)
            }
        }

        confirmedPlayerToDeconfirm.forEach((player) => {
            raid.member.registered.push(player)
            raid.member.confirmed = raid.member.confirmed.filter((confirmedPlayer) => {
                return confirmedPlayer !== player
            })
        })

        await bot.database.addOrUpdateRaid(raid)
        MessageHandler.updatePrintedRaid(bot, raid)
        msg.reply(`Alle Spieler, die identifiziert werden konnten, wurden bei dem Raid ${raid.id} von bestätigt auf angemeldet gesetzt.`)
    } catch(error) {
        msg.reply(error.message)
        console.log(`deconfirm:\n${error.stack}`)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['deconfirm'],
    permLevel: 3
}

exports.help = {
    name: 'ablehnen',
    description: 'Bestätigte Spieler vom Raid ablehnen',
    usage: 'ablehnen <raidID> <Nummer> <Nummer> <Nummer> ...'
}
