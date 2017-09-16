const Discord = require("discord.js");
const config = require("./config.json");
const privateConfig = require("./privateConfig.json");
const raidHandler = require("./raidHandler/raidHandler");
const fs = require("fs");

const bot = new Discord.Client();
require('./utils/eventLoader')(bot);

const prefix = config.prefix;

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
fs.readdir(config.commandsFolderPath, (error, files) => {
    if (error) console.error(error);
    console.log(`${files.length} commands loaded.`);
    files.forEach(f => {
        let props = require(`${config.commandsFolderPath}${f}`);
        console.log(`Loading Command: ${props.help.name} OK!`);
        bot.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            bot.aliases.set(alias, props.help.name);
        });
    });
});

bot.elevation = msg => {
    /* This function should resolve to an ELEVATION level which
       is then sent to the command handler for verification*/
    const guildMember = bot.guilds.find("id", config.serverID).member(msg.author);
    let permlvl = 0;
    if (guildMember.roles.has(config.roles.member)) permlvl = 1;
    if (guildMember.roles.has(config.roles.lead)) permlvl = 2;
    if (guildMember.roles.has(config.roles.admin)) permlvl = 3;
    //if (msg.author.id === config.ownerid) permlvl = 4;
    return permlvl;
  };

bot.login(`${privateConfig.token}`)
    .then(() => {
        bot.db = new database();
        bot.raidManager = new raidHandler(bot);
    });