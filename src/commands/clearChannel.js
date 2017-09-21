exports.run = (bot, msg, args) => {
    bot.raidManager.clearChannel();
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