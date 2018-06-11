const MessageHandler = require('../util/messageHandler')

exports.run = async (bot, msg, args) => {
    try {
        if(args.length !== 2) {
            msg.reply('Too few arguments!')
            return
        }

        const raidID = parseInt(args[0])
        const shortName = args[1]
        const userID = msg.author.id

        const raid = await bot.database.getRaidByID(raidID)
        if(!raid) {
            msg.reply('Couldn\'t find raid. Please check user input and try again!')
            return
        }

        const player = await bot.database.getPlayerByShortNameAndDiscordID(shortName, userID)
        if(!player) {
            msg.reply('Couldn\'t find player. Please check user input and try again!')
            return
        }

        const isAlreadyRegistered = raid.member.registered.includes(player.ingameName)
        const isAlreadyConfirmed = raid.member.confirmed.includes(player.ingameName)
        if(isAlreadyConfirmed || isAlreadyRegistered) {
            msg.reply('You are already registered for this raid!')
            return
        }

        raid.member.registered.push(player.ingameName)

        const isAlreadyDeregistered = raid.member.deregistered.includes(player.ingameName)
        if(isAlreadyDeregistered) {
            raid.member.deregistered = raid.member.deregistered.filter((element) => {
                return element !== player.ingameName
            })
        }

        await bot.database.addOrUpdateRaid(raid)
        MessageHandler.updatePrintedRaid(bot, raid)
        msg.reply(`You are now successfully registered to raid ${raid.id}`)
    } catch(error) {
        msg.reply(error.message)
        console.log(`register: ${error}`)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
}

exports.help = {
    name: 'register',
    description: 'Register to raid. What did you expect?',
    usage: 'register <raidID> <shortName>'
}
