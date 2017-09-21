exports.run = (bot, msg) => {
    try {
        const args = msg.content.toLowerCase().split(" ").splice(1);
        if(args.length !== 4) {
            msg.reply("Couldn't create character! Invalid number of Arguments!");
            return;
        }

        const id = msg.author.id;
        const name = args[0].split("@")[0];
        const shard = args[0].split("@")[1];
        const riftClass = args[1];
        const roles = args[2];
        const shortName = args[3];

        const status = bot.db.createCharacter(id, name, shard, riftClass, roles, shortName);

        if(status === "NEW") {
            msg.reply(`Created new character ${args[0]}`);
        } else if(status === "UPDATE") {
            msg.reply(`Updated ${args[0]}`);
        } else {
            msg.reply(`couldn't create ${args[0]}. Don't know why! :(`);
        }
    } catch(error) {
        console.log(`create: ${error}`);
    }
};
  
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 2
};

exports.help = {
    name: "create",
    description: "Creates a Character.",
    usage: "create <Name> <Class> <Roles> <ShortName>"
};