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

        let registerIDsToConfirm
        for(let index = 1; index < args.length; index++) {
            registerIDsToConfirm.push(parseInt(args[index]))
        }

        registerIDsToConfirm.forEach((element) => {
            if(raid.member.registered[element]) {
                const name = raid.member.registered[element]
                raid.member.registered = raid.member.registered.filter((element) => {
                    return element !== name
                })
                raid.member.confirmed.push(name)
            }
        })

        await bot.database.addOrUpdateRaid(raid)
        MessageHandler.updatePrintedRaid(bot, raid)
        msg.reply(`Confirmed all valid player for raid ${raid.id}`)
    } catch(error) {
        msg.reply(error.message)
        console.log(`confirm: ${error}`)
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
