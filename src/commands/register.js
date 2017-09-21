exports.run = (bot, msg) => {
    msg.reply("Couldn't register you to raid");
};
  
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 2
};

exports.help = {
    name: "register",
    description: "Register to raid. What did you expect?",
    usage: "register <raidID> <shortName>"
};