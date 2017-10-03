const Discord = require("discord.js");
const config = require("./config.json");
const privateConfig = require("./privateConfig.json");
const messagehandler = require("./messageHandler");
const db = require("sqlite");

const bot = new Discord.Client();
const prefix = config.prefix;
let messageHandler;

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
    messageHandler = new messagehandler(bot);
});

bot.on('message', msg => {
    if(msg.content.startsWith(config.communicationPrefix)) return;

    if(msg.channel.type === 'dm' && !msg.author.bot) {
        guildMember = bot.guilds.find("id", config.serverID).member(msg.author);
        if (guildMember) {
            if(guildMember.roles.has(config.roles.offi)) {
                messageHandler.offiCommand(msg);
            // quickfix for guest users
            //} else if(guildMember.roles.has(config.roles.member)) {
            //    messageHandler.memberCommand(msg);
            } else {
                messageHandler.memberCommand(msg);
            }
        }
    }

    if(!msg.content.startsWith(prefix) || msg.author.bot) return;
});

bot.login(`${privateConfig.token}`)
