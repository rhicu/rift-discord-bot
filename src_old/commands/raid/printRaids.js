const MessageHandler = require('../../util/messageHandler')

exports.run = (bot, msg) => {
    try {
        MessageHandler.updatePrintedRaids(bot)
        if(msg) {
            msg.reply(`Alle Raids erneut ausgegeben!`)
        }
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
    aliases: ['print', 'printRaids'],
    permLevel: 3
}

exports.help = {
    name: 'raidsAusgeben',
    description: 'Löscht alle Nachrichten im Raid Planner Channel und gibt die verfügbaren Raids erneut aus',
    usage: 'raidsAusgeben'
}
