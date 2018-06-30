const MessageHandler = require('../util/messageHandler')
const util = require('../util/util')

exports.run = async (bot, msg, args) => {
    try {
        if(args.length !== 1) {
            msg.reply('Too few arguments!')
            if (bot.commands.has('help')) {
                bot.commands.get('help').run(bot, msg, 'help', 0)
            }
            return
        }

        const raidID = parseInt(args[0])
        const userID = msg.author.id

        const raid = await bot.database.getRaidByID(raidID)
        if(!raid) {
            msg.reply('Couldn\'t find raid. Please check user input and try again!')
            return
        }

        const playerNames = util.getPlayerNamesFromJSONArray(raid.member.registered).concat(util.getPlayerNamesFromJSONArray(raid.member.deregistered))
        const player = await bot.database.getPlayerByNameArrayAndDiscordID(playerNames, userID)
        if(!player) {
            msg.reply('Couldn\'t find player. Please check user input and try again!')
            return
        }

        const isDeregistered = raid.member.deregistered.filter((member) => {
            return member.name === player.ingameName
        })
        if(isDeregistered.length !== 0) {
            msg.reply('You are already deregistered!')
            return
        }

        const isRegistered = raid.member.registered.filter((member) => {
            return member.name === player.ingameName
        })
        if(isRegistered.length !== 0) {
            raid.member.registered = raid.member.registered.filter((element) => {
                return element.name !== player.ingameName
            })
        }

        const isConfirmed = raid.member.confirmed.filter((member) => {
            return member.name === player.ingameName
        })
        if(isConfirmed.length !== 0) {
            raid.member.confirmed = raid.member.confirmed.filter((element) => {
                return element.name !== player.ingameName
            })
        }

        const playerData = {
            name: player.ingameName,
            data: `${util.makeFirstLetterOfStringUppercase(player.riftClass)} - ${util.formatPlayerName(player.ingameName)} (${util.rolesToString(player.roles)})`
        }
        raid.member.deregistered.push(playerData)

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
    permLevel: 0
}

exports.help = {
    name: 'deregister',
    description: 'Deregister from raid. What did you expect?',
    usage: 'deregister <raidID>'
}
