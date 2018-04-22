exports.run = (bot, msg) => {
    msg.reply('Couldn\'t delete raid')
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['delete'],
    permLevel: 3
}

exports.help = {
    name: 'deleteRaid',
    description: 'Just deleting a stupid created raid from planner',
    usage: 'deleteRaid <raidID>'
}
