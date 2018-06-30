const MessageHandler = require('../util/messageHandler')

exports.run = async (bot, msg, args) => {
    try {
        if(args.length < 2) {
            msg.reply('Too few arguments!')
            return
        }

        const raidID = parseInt(args[0])
        const raid = await bot.database.getRaidByID(raidID)
        if(!raid) {
            msg.reply('Couldn\'t find raid. Please check user input and try again!')
            return
        }

        let registerIDsToConfirm = []
        for(let index = 1; index < args.length; index++) {
            registerIDsToConfirm.push(parseInt(args[index]))
        }

        registerIDsToConfirm.forEach((index) => {
            if(raid.member.registered[index-1]) {
                const player = raid.member.registered[index-1]
                raid.member.registered = raid.member.registered.filter((registeredPlayer) => {
                    return registeredPlayer !== player
                })
                raid.member.confirmed.push(player)
            }
        })

        await bot.database.addOrUpdateRaid(raid)
        MessageHandler.updatePrintedRaid(bot, raid)
        msg.reply(`Confirmed all valid player for raid ${raid.id}`)
    } catch(error) {
        msg.reply(error.message)
        console.log(`confirm: ${error.stack}`)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
}

exports.help = {
    name: 'confirm',
    description: 'Unregister from raid. What did you expect?',
    usage: 'confirm <raidID> <register number> <register number> <register number> ...'
}
