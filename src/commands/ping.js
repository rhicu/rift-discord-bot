exports.run = (bot, msg) => {
    msg.channel.send('Ping?')
        .then((msg) => {
            msg.edit(`Pong! (took: ${msg.createdTimestamp - msg.createdTimestamp}ms)`)
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
    description: 'Ping/Pong command. I wonder what this does? /sarcasm',
    usage: 'ping'
}
