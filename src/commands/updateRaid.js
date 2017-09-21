exports.run = (bot, msg) => {
    msg.reply("Couldn't update raid");
};
  
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["update"],
    permLevel: 2
};

exports.help = {
    name: "updateRaid",
    description: "Just updating a raid, you know",
    usage: "updateRaid <raidID> <property> <value>"
};