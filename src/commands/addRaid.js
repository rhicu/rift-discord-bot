exports.run = (bot, msg) => {
    msg.reply("Couldn't create raid");
};
  
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["add"],
    permLevel: 2
};

exports.help = {
    name: "addRaid",
    description: "Just adding a fucking new raid to planner",
    usage: "addRaid <td / irotp> <day> <date>"
};