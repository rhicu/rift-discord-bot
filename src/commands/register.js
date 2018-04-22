const MessageHandler = require('../util/messageHandler')

exports.run = (bot, msg, args) => {
    // msg.reply('Couldn\'t register you to raid')

    if(args.length !== 2) {
        msg.reply('Exactly 2 arguments required. Please Check input and try again!')
    }

    const raidID = parseInt(args[0])
    let player
    let raid
    Promise.all([
        bot.database.getPlayerByShortNameAndDiscordID(args[1], msg.author.id),
        bot.database.getRaidByID(raidID)
    ]).then((result) => {
        if(!result || !result[0] || !result[1]) {
            throw new Error('Couldn\'t register player to raid. Is it a character of yours and the raid ID is correct?')
        } else {
            player = result[0]
            raid = result[1]

            raid.member.registered.push(player.id)
            return bot.database.addOrUpdateRaid()
        }
    }).then((result) => {
        MessageHandler.updatePrintedRaids(bot)
        msg.reply(`You are now registered for raid ${raid._id} with ${player.name}`)
    }).catch((error) => {
        msg.reply(error.message)
    })
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 2
}

exports.help = {
    name: 'register',
    description: 'Register to raid. What did you expect?',
    usage: 'register <raidID> <shortName>'
}
