const PlayerFactory = require('../user/playerFactory')

exports.run = (bot, msg, args) => {
    try {
        // create Player object
        const discordID = msg.author.id
        const newPlayer = PlayerFactory.createPlayerFromUserInput(args, discordID)

        // check if input was valid
        if(!newPlayer) {
            msg.reply('Something went wrong! Please check your input and try again!')
            return
        }

        // check if character already exists and was created by this user
        bot.database.isEntitledToUpdatePlayer(newPlayer)
            .then((result) => {
                if(result === false) {
                    msg.reply('You are not allowed to update this character!')
                } else {
                    // check if character already exists
                    bot.database.addOrUpdatePlayer(newPlayer)
                        .then((result) => {
                            if(result === true) {
                                msg.reply(`New charackter ${newPlayer.ingameName} successfully created!`)
                            } else {
                                msg.reply(`Charackter ${newPlayer.ingameName} successfully updated!`)
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
        console.log(`create: ${error}`)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['create', 'addPlayer'],
    permLevel: 0
}

exports.help = {
    name: 'createPlayer',
    description: 'Creates a Character.',
    usage: 'create <Name> <Class> <Roles> <ShortName>'
}
