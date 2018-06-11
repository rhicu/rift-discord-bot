const MessageHandler = require('../util/messageHandler')

exports.run = (bot, msg) => {
    try {
        MessageHandler.updatePrintedRaids(bot)
        if(msg) {
            msg.reply(`All raids printed again!`)
        }
    } catch(error) {
        if(msg) {
            msg.reply(error.message)
        }
        console.log(error.message)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['print'],
    permLevel: 3
}

exports.help = {
    name: 'printRaids',
    description: 'Deletes all messages in raidPlanner channel and prints raids again.',
    usage: 'printRaids'
}
