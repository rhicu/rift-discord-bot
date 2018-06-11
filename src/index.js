const Discord = require('discord.js')
const fs = require('fs')
const config = require('./config.json')
const Database = require('./db/database')
Database.init()

const bot = new Discord.Client()
require('./util/eventLoader')(bot)

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`)
})

bot.database = Database
bot.commands = new Discord.Collection()
bot.aliases = new Discord.Collection()
fs.readdir('./src/commands', (error, files) => {
    if (error) console.error(error)
    console.log(`${files.length} commands loaded.`)
    files.forEach((f) => {
        let props = require(`./commands/${f}`)
        console.log(`Loading Command: ${props.help.name} OK!`)
        bot.commands.set(props.help.name.toLowerCase(), props)
        props.conf.aliases.forEach((alias) => {
            bot.aliases.set(alias.toLowerCase(), props.help.name.toLowerCase())
        })
    })
})

bot.elevation = (msg) => {

    if(msg.author.bot) return

    /**
     * This function should resolve to an ELEVATION level which
     * is then sent to the command handler for verification
     */
    const guildMember = bot.guilds.find('id', config.serverID).member(msg.author)
    let permlvl = 0
    if (guildMember.roles.has(config.roles.friend)) permlvl = 1
    if (guildMember.roles.has(config.roles.member)) permlvl = 2
    if (guildMember.roles.has(config.roles.lead)) permlvl = 3
    if (guildMember.roles.has(config.roles.admin)) permlvl = 4
    // if (msg.author.id === config.ownerid) permlvl = 5
    return permlvl
}

bot.login(`${config.token}`)
