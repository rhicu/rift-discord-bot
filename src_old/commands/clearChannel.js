const MessageHandler = require('../util/messageHandler')

exports.run = (bot, msg, args) => {
    try {
        if(args.length !== 1) {
            msg.reply('Bitte nur genau einen Parameter übergeben!')
            return
        }
        MessageHandler.clearChannel(bot, args[0])
        msg.reply(`All Nachrichten vom Channel "${args[0]}" gelöscht`)
    } catch(error) {
        msg.reply(error.message)
        console.log(`clearChannel:\n${error.stack}`)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['clear', 'clearChannel'],
    permLevel: 4
}

exports.help = {
    name: 'channelAufräumen',
    description: 'Löscht alle Nachrichten eines Channels',
    usage: 'channelAufräumen <Channel Name>'
}
