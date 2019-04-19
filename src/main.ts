import Bot from "./lib/bot/Bot";
import config from "./private.conf";
import { BotOptions } from "./lib/bot/BotOptions";
import CommandHandler from "./lib/command/CommandHandler";
import path from 'path'

const bot = new Bot({prefix: '', responseTime: 30})
const commandHandler = new CommandHandler(path.resolve(__dirname, 'commands'), bot)
bot.commandHandler = commandHandler

bot
    .on('ready', () => {
        console.log('Logged in!')
    })
    .on('message', (msg) => {
        if(msg.author.bot) return
        commandHandler.executeCommand(msg)
    })

bot.login(config.token)
