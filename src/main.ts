import Bot from './lib/bot/Bot'
import config from './private.conf'
import CommandHandler from './lib/command/CommandHandler'

const bot = new Bot({prefix: '', responseTime: 30})
bot.commandHandler = new CommandHandler(bot)

bot
    .on('ready', () => {
        console.log('Logged in!')
    })
    .on('message', (msg) => {
        if(msg.author.bot) return
        bot.commandHandler.executeCommand(msg)
    })

bot.login(config.token)
