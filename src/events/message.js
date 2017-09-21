const config = require("../config.json");
module.exports = msg => {
    if(msg.content.startsWith(config.communicationPrefix)) return;
    if(msg.channel.type !== "dm") return;

    let client = msg.client;
    if (msg.author.bot) return;
    //if (!msg.content.startsWith(config.prefix)) return;

    let command = msg.content.split(" ")[0];
    let args = msg.content.split(" ").slice(1);
    let permissionLevel = client.elevation(msg);
    let cmd;
    if (client.commands.has(command)) {
        cmd = client.commands.get(command);
    } else if (client.aliases.has(command)) {
        cmd = client.commands.get(client.aliases.get(command));
    }
    if (cmd) {
        if (permissionLevel < cmd.conf.permLevel) return;
        cmd.run(client, msg, args, permissionLevel);
    }
};