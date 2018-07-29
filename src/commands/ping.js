exports.run = (bot, msg) => {
    msg.channel.send('Ping?')
        .then((message) => {
            message.edit(`Pong! (Verzögerung: ${message.createdTimestamp - msg.createdTimestamp}ms)`)
        })
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
}

exports.help = {
    name: 'ping',
    description: 'Ping/Pong Befehl. I wonder what this does? /sarcasm',
    usage: 'ping'
}
