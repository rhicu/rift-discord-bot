const Discord = require("discord.js");
const config = require("./config.json");
const messagehandler = require("./messageHandler");

const bot = new Discord.Client();
const prefix = config.prefix;

var messageHandler = new messagehandler(bot);

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if(msg.channel.type === 'dm' && !(msg.author.bot)) {
    guildMember = bot.guilds.find("id", config.serverID).member(msg.author);
    if (guildMember) {
      if(guildMember.roles.has(config.roles.member)) {
        messageHandler.memberCommand(msg);
      }
      if(guildMember.roles.has(config.roles.offi)) {
        messageHandler.offiCommand(msg);
      }
    }
  }

  if(!msg.content.startsWith(prefix) || message.author.bot) return;
});

bot.login(`${config.token}`);