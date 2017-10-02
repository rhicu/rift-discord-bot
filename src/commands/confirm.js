exports.run = (bot, msg) => {
    msg.reply('Couldn\'t confirm to raid');
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 2
};

exports.help = {
    name: 'confirm',
    description: 'Unregister from raid. What did you expect?',
    usage: 'confirm <raidID> <register number> <register number> <register number> ...'
};
