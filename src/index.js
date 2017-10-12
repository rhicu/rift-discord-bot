const Discord = require('discord.js')
const config = require('./config.json')
const privateConfig = require('./privateConfig.json')
const Messagehandler = require('./messageHandler')
const db = require('sqlite')
const newDB = require('sqlite')

const bot = new Discord.Client()
const prefix = config.prefix
let messageHandler

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`)
    messageHandler = new Messagehandler(bot, db, newDB)
})

bot.on('message', (msg) => {
    if(msg.content.startsWith(config.communicationPrefix)) return

    if(msg.channel.type === 'dm' && !msg.author.bot) {
        const guildMember = bot.guilds.find('id', config.serverID).member(msg.author)
        if (guildMember) {
            if(guildMember.roles.has(config.roles.offi)) {
                messageHandler.offiCommand(msg)
            // quickfix for guest users
            // } else if(guildMember.roles.has(config.roles.member)) {
            //     messageHandler.memberCommand(msg)
            } else {
                messageHandler.memberCommand(msg)
            }
        }
    }

    if(!msg.content.startsWith(prefix) || msg.author.bot) return
})

db.open(`${config.dbPath}riftDiscordBot.sqlite`)
    .then(() => {
        newDB.open(`${config.dbPath}newDatabase.sqlite`)
            .then(() => {
                bot.login(`${privateConfig.token}`)
            }).catch((error) => {
                console.log(`open new database: ${error}`)
            })
    }).catch((error) => {
        console.log(`open database: ${error}`)
    })

