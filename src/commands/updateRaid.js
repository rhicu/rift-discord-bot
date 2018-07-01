const MessageHandler = require('../util/messageHandler')
const Time = require('../util/time')

exports.run = (bot, msg, args) => {
    try {
        if(args.length !== 3) {
            msg.reply('Falsche Eingabe! Es wurden 3 Argumente Erwartet!')
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
                                msg.reply('Datum konnte nicht aktualisiert werden. Fehlerhafte Eingabe!')
                                return
                            }
                            break
                        }
                        case 'start': {
                            const dateString = Time.dateToGermanDateString(raid.start)
                            const newDate = Time.getDateFromGermanDateAndTimeString(dateString, value)
                            if(newDate) {
                                raid.start = newDate
                            } else {
                                msg.reply('Startzeit konnte nicht aktualisiert werden. Fehlerhafte Eingabe!')
                                return
                            }
                            break
                        }
                        case 'end': {
                            const dateString = Time.dateToGermanDateString(raid.end)
                            const newDate = Time.getDateFromGermanDateAndTimeString(dateString, value)
                            if(newDate) {
                                raid.end = newDate
                            } else {
                                msg.reply('Endzeit konnte nicht aktualisiert werden. Fehlerhafte Eingabe!')
                                return
                            }
                            break
                        }
                        case 'raidlead': {
                            raid.raidLead = value
                            break
                        }
                        default: {
                            msg.reply(`'${option}' ist keine Eigenschaft, die aktualisiert werden kann!`)
                            return
                        }
                    }
                    bot.database.addOrUpdateRaid(raid)
                        .then(() => {
                            MessageHandler.updatePrintedRaid(bot, raid)
                            msg.reply(`Raid ${raid.type} am ${Time.dateToDateString(raid.start)} wurde aktualisiert!`)
                        }).catch((error) => {
                            msg.reply(error.message)
                            console.log(`updateRaid:\n${error.stack}`)
                        })
                } else {
                    msg.reply('Beim aktualisieren ist ein Fehler aufgetreten! Existiert ein Raid mit dieser ID?')
                }
            })
    } catch(error) {
        msg.reply(error.message)
        console.log(`updateRaid:\n${error.stack}`)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['update', 'updateRaid'],
    permLevel: 3
}

exports.help = {
    name: 'raidAktualisieren',
    description: 'Aktualisiert eien Eigenschaft eines Raids',
    usage: 'raidAktualisieren <raidID> <Eigenschaft> <Wert>'
}
