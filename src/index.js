const Discord = require('discord.js')
const config = require('./config.json')
const MessageHandler = require('./messageHandler/messageHandler')

const bot = new Discord.Client()
const prefix = config.prefix

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`)
    MessageHandler.init()
})

bot.on('message', (msg) => {
    if(msg.content.startsWith(config.communicationPrefix)) return

    if(msg.channel.type === 'dm' && !msg.author.bot) {
        const guildMember = bot.guilds.find('id', config.serverID).member(msg.author)
        if (guildMember) {
            if(guildMember.roles.has(config.roles.offi)) {
                MessageHandler.offiCommand(msg)
            // quickfix for guest users
            // } else if(guildMember.roles.has(config.roles.member)) {
            //     MessageHandler.memberCommand(msg)
            } else {
                MessageHandler.memberCommand(msg)
            }
        }
    }

    if(!msg.content.startsWith(prefix) || msg.author.bot) return
})

bot.login(`${config.token}`)
