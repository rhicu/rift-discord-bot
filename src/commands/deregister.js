const MessageHandler = require('../util/messageHandler')

exports.run = async (bot, msg, args) => {
    try {
        if(args.length !== 1) {
            msg.reply('Too few arguments!')
            return
        }

        const raidID = parseInt(args[0])
        const userID = msg.author.id

        const raid = await bot.database.getRaidByID(raidID)
        if(!raid) {
            msg.reply('Couldn\'t find raid. Please check user input and try again!')
            return
        }

        const playerNames = raid.member.registered.concat(raid.member.deregistered)
        const player = await bot.database.getPlayerByNameArrayAndDiscordID(playerNames, userID)
        if(!player) {
            msg.reply('Couldn\'t find player. Please check user input and try again!')
            return
        }

        const isDeregistered = raid.member.deregistered.includes(player.ingameName)
        if(isDeregistered) {
            msg.reply('You are already deregistered!')
            return
        }

        const isRegistered = raid.member.registered.includes(player.ingameName)
        const isConfirmed = raid.member.confirmed.includes(player.ingameName)
        if(isRegistered) {
            raid.member.registered = raid.member.registered.filter((element) => {
                return element !== player.ingameName
            })
        }
        if(isConfirmed) {
            raid.member.confirmed = raid.member.confirmed.filter((element) => {
                return element !== player.ingameName
            })
        }

        raid.member.deregistered.push(player.ingameName)

        await bot.database.addOrUpdateRaid(raid)
        MessageHandler.updatePrintedRaid(bot, raid)
        msg.reply(`You are now successfully deregistered from raid ${raid.id}`)
    } catch(error) {
        msg.reply(error.message)
        console.log(`deregister: ${error}`)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['unregister'],
    permLevel: 2
}

exports.help = {
    name: 'deregister',
    description: 'Deregister from raid. What did you expect?',
    usage: 'deregister <raidID>'
}
