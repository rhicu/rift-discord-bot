const PlayerFactory = require('../user/playerFactory')

exports.run = (bot, msg, args) => {
    try {
        // create Player object
        const discordID = 'GUEST'
        const newPlayer = PlayerFactory.createPlayerFromUserInput(args, discordID)

        // check if input was valid
        if(!newPlayer) {
            msg.reply('Spieler konnte nicht erstellt werden. Prüfe deine Eingabe und versuchs nochmal!')
            if (bot.commands.has('help')) {
                bot.commands.get('help').run(bot, msg, 'help', 0)
            }
            return
        }

        // check if character already exists and was created by this user
        bot.database.isEntitledToUpdatePlayer(newPlayer)
            .then((result) => {
                if(result === false) {
                    msg.reply('Du bist nicht berechtigt diesen Charakter zu aktualisieren!')
                } else {
                    // check if character already exists
                    bot.database.addOrUpdatePlayer(newPlayer)
                        .then((result) => {
                            if(result === true) {
                                msg.reply(`Neuer Charakter ${newPlayer.ingameName} erfolgreich erstellt!`)
                            } else {
                                msg.reply(`Charakter ${newPlayer.ingameName} erfolgreich aktualisiert!`)
                            }
                        }).catch((error) => {
                            msg.reply(error.message)
                        })
                }
            }).catch((error) => {
                msg.reply(error.message)
            })
    } catch(error) {
        msg.reply(error.message)
        console.log(`createPlayer:\n${error.stack}`)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['createGuest'],
    permLevel: 3
}

exports.help = {
    name: 'gastErstellen',
    description: 'Erstellt einen neuen Gast Charakter oder aktualisiert einen bestehenden',
    usage: 'gastErstellen <Name> <Klasse> <Rollen (durch Komma getrennt)>'
}
