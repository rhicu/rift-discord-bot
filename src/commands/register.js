const MessageHandler = require('../util/messageHandler')
const util = require('../util/util')

exports.run = async (bot, msg, args) => {
    try {
        if(args.length !== 2) {
            msg.reply('Too few arguments!')
            if (bot.commands.has('help')) {
                bot.commands.get('help').run(bot, msg, 'help', 0)
            }
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

        const isAlreadyRegistered = raid.member.registered.filter((member) => {
            return member.name === player.ingameName
        })
        const isAlreadyConfirmed = raid.member.confirmed.filter((member) => {
            return member.name === player.ingameName
        })

        if(isAlreadyConfirmed.length !== 0 || isAlreadyRegistered.length !== 0) {
            msg.reply('You are already registered for this raid!')
            return
        }

        const playerData = {
            name: player.ingameName,
            data: `${util.makeFirstLetterOfStringUppercase(player.riftClass)} - ${util.formatPlayerName(player.ingameName)} (${util.rolesToString(player.roles)})`
        }
        raid.member.registered.push(playerData)

        const isAlreadyDeregistered = raid.member.deregistered.filter((member) => {
            return member.name === player.ingameName
        })
        if(isAlreadyDeregistered) {
            raid.member.deregistered = raid.member.deregistered.filter((element) => {
                return element.name !== player.ingameName
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
