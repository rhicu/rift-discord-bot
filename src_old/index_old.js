const Discord = require('discord.js')
const config = require('./config.json')
const Database = require('./db/database')
const path = require('path')
const CommandHandler = require('./commandHandler')

Database.init()

const bot = new Discord.Client()
require('./util/eventLoader')(bot)

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`)
    bot.commands.get('raid raidsausgeben').run(bot, null)
})

bot.database = Database

const commandsFolderPath = path.resolve(__dirname, 'commands')
bot.commandHandler = new CommandHandler(commandsFolderPath)
bot.commandHandler.loadCommands()
bot.commandHandler._getCommand('help')

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
