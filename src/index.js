const Discord = require("discord.js");
const config = require("./config.json");
const bot = new Discord.Client();

const prefix = config.prefix;

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {

  if(msg.channel.type === 'dm' && !message.author.bot) {
    if (msg.content === `${prefix}ping`) {
      msg.reply('>ping');
    }
  }

  if(!msg.content.startsWith(prefix) || message.author.bot) return;

  
});

bot.login(`${config.token}`);