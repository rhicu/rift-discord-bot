const MessageHandler = require('../util/messageHandler')

exports.run = (bot, msg, args) => {
    try {
        // msg.reply('Couldn\'t clear channel')
        if(args.length !== 1) {
            msg.reply('Number of Arguments has to equal 1. Please check and try again!')
            return
        }
        MessageHandler.clearChannel(bot, args[0])
        msg.reply(`All messages from channel ${args[0]} deleted`)
    } catch(error) {
        msg.reply(error.message)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['clear'],
    permLevel: 4
}

exports.help = {
    name: 'clearChannel',
    description: 'Deletes all messages in raidPlanner channel.',
    usage: 'clearChannel'
}
