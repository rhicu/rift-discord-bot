const MessageHandler = require('../util/messageHandler')

exports.run = (bot, msg, args) => {
    try {
        if(args.length !== 1) {
            msg.reply('Invalid Number of Arguments. Please check input and try again!')
            return
        }

        const raidID = parseInt(args[0])

        // let raid = bot.database.getRaidByID()
        // if(!raid) {
        //     msg.reply(`Couldn't find raid with ID ${raidID}`)
        //     return
        // }

        // raid.shouldBeDisplayed = false

        bot.database.deleteRaid(raidID)
            .then((result) => {
                if(result) {
                    msg.reply('Raid successfully deleted!')
                    MessageHandler.updatePrintedRaids(bot)
                } else {
                    msg.reply('Couldn\'t delete raidID. Is the ID correct?')
                }
            })
    } catch(error) {
        msg.reply(error.message)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['delete'],
    permLevel: 3
}

exports.help = {
    name: 'deleteRaid',
    description: 'Just deleting a stupid created raid from planner',
    usage: 'deleteRaid <raidID>'
}
