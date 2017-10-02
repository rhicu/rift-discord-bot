exports.run = (bot, msg) => {
    msg.reply('Couldn\'t unregister from raid');
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 2
};

exports.help = {
    name: 'unregister',
    description: 'Unregister from raid. What did you expect?',
    usage: 'unregister <raidID>'
};
