const MessageHandler = require('../util/messageHandler')
const Time = require('../util/time')

exports.run = (bot, msg, args) => {
    try {
        if(args.length !== 3) {
            msg.reply('Invalid number of arguments!')
            return
        }

        const id = parseInt(args[0])
        bot.database.getRaidByID(id)
            .then((raid) => {
                if(raid) {
                    const option = args[1]
                    const value = args[2]
                    switch(option) {
                        case 'type': {
                            raid.type = value
                            break
                        }
                        case 'date': {
                            const timeString = Time.dateToTimeString(raid.start).split(':').slice(0, -1).join(':')
                            const newDate = Time.getDateFromGermanDateAndTimeString(value, timeString)
                            if(newDate) {
                                raid.start = newDate
                            } else {
                                msg.reply('Could not update date. Invalid user input')
                            }
                            break
                        }
                        case 'start': {
                            const dateString = Time.dateToGermanDateString(raid.start)
                            const newDate = Time.getDateFromGermanDateAndTimeString(dateString, value)
                            if(newDate) {
                                raid.start = newDate
                            } else {
                                msg.reply('Could not update start time. Invalid user input')
                            }
                            break
                        }
                        case 'end': {
                            const dateString = Time.dateToGermanDateString(raid.end)
                            const newDate = Time.getDateFromGermanDateAndTimeString(dateString, value)
                            if(newDate) {
                                raid.end = newDate
                            } else {
                                msg.reply('Could not update end time. Invalid user input')
                            }
                            break
                        }
                        case 'raidlead': {
                            raid.raidLead = value
                            break
                        }
                        default: {
                            msg.reply(`'${option}' is not a property which can be updated!`)
                            return
                        }
                    }
                    bot.database.addOrUpdateRaid(raid)
                        .then(() => {
                            MessageHandler.updatePrintedRaid(bot, raid)
                            msg.reply(`Raid ${raid.type} on ${Time.dateToDateString(raid.start)} has been updated!`)
                        }).catch((error) => {
                            console.log(`updateRaid: ${error}`)
                            msg.reply('something bad happened :(')
                        })
                } else {
                    msg.reply('Error while trying to update raid! Maybe the raid does not esist?')
                }
            })
    } catch(error) {
        console.log(`updateRaid: ${error}`)
        msg.reply('something bad happened :(')
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['update'],
    permLevel: 3
}

exports.help = {
    name: 'updateRaid',
    description: 'Just updating a raid, you know',
    usage: 'updateRaid <raidID> <property> <value>'
}
