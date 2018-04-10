exports.run = (bot, msg, args) => {
    msg.reply('Couldn\'t clear channel')
    // bot.raidManager.clearChannel();
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["clear"],
    permLevel: 2
};
  
exports.help = {
    name: "clearChannel",
    description: "Deletes all messages in raidPlanner channel.",
    usage: "clearChannel"
};