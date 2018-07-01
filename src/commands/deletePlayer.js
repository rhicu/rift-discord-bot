
exports.run = (bot, msg, args) => {
    try {
        if(args.length !== 1) {
            msg.reply('Bitte nur genau einen Parameter übergeben!')
            if (bot.commands.has('help')) {
                bot.commands.get('help').run(bot, msg, 'help', 0)
            }
            return
        }

        const discordID = msg.author.id
        bot.database.getPlayerByShortNameAndDiscordID(args[0], discordID)
            .then((player) => {
                if(!player) {
                    msg.reply('Charakter konnte nicht gelöscht werden. Entweder der Charakter existiert nicht, ist falsch geschrieben oder wurde nicht von dir erstellt!')
                    return
                } else {
                    bot.database.deletePlayer(args[0], discordID)
                        .then((wasDeleted) => {
                            if(wasDeleted) {
                                msg.reply(`Charakter erfolgreich gelöscht!`)
                            } else {
                                msg.reply(`Charakter konnte nicht gelöscht werden!`)
                            }
                        })
                }
            })
    } catch(error) {
        msg.reply(error.message)
        console.log(`deletePlayer:\n${error.stack}`)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['deletePlayer'],
    permLevel: 0
}

exports.help = {
    name: 'spielerLöschen',
    description: 'Löscht einen selbst erstellten Charakter',
    usage: 'spielerLöschen <Spitzname / Abkürzung>'
}
