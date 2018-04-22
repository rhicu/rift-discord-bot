exports.run = (bot, msg, args) => {
    if(args.length !== 1) {
        msg.reply('Exactly 1 argument expected. Please check input and try again!')
        return
    }

    const raidID = parseInt(args[0])
    bot.database.deleteRaid(raidID)
        .then((result) => {
            if(result) {
                bot.database.updatePrintedRaids()
                msg.reply('Successfully deleted raid!')
            } else {
                msg.reply(`Could not delete raid with id ${raidID}. Please check input and try again!`)
            }
        })
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
