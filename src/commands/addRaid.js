const raidFactory = require('../raid/raidFactory')
const MessageHandler = require('../util/messageHandler')

exports.run = (bot, msg, args) => {
    try {
        const newRaid = raidFactory.createRaidFromUserInput(args)

        if(!newRaid) {
            msg.reply('Couldn\'t create raid. Please check input!')
            return
        }

        bot.database.addOrUpdateRaid(newRaid)
            .then((result) => {
                if(result) {
                    MessageHandler.updatePrintedRaids(bot)
                    msg.reply(`Successfully created Raid ${newRaid.type} on ${newRaid.start}`)
                } else {
                    msg.reply('Couldn\'t create raid in database. Please try again!')
                }
            }).catch((error) => {
                msg.reply(error.message)
            })
    } catch(error) {
        msg.reply(error.message)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['add'],
    permLevel: 3
}

exports.help = {
    name: 'addRaid',
    description: 'Just adding a fucking new raid to planner',
    usage: 'addRaid <td / irotp> <day> <date>'
}
