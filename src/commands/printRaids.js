const MessageHandler = require('../util/messageHandler')

exports.run = (bot, msg) => {
    try {
        MessageHandler._clearRaidPlanerChannel(bot)
            .then(() => {
                MessageHandler.updatePrintedRaids(bot)
                msg.reply(`All raids printed again!`)
            })
    } catch(error) {
        msg.reply(error.message)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['print'],
    permLevel: 2
}

exports.help = {
    name: 'printRaids',
    description: 'Deletes all messages in raidPlanner channel and prints raids again.',
    usage: 'printRaids'
}
