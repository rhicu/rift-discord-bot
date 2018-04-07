 /**
     * @public
     * @param {Message} message
     */
    static deletePlayer(message) {
        const userInput = Util._beautifyUserInput(message.content)
        const splittedUserInput = userInput.split(' ').splice(1)

        if(splittedUserInput.length < 1) {
            message.reply('Too few arguments! Check input and try again!')
            return
        }

        const discordID = message.author.id
        const shortName = splittedUserInput[0]

        try {
            Database.deletePlayer(shortName, discordID)
                .then((result) => {
                    if(result) {
                        message.reply(`${shortName} has been deleted successfully!`)
                    } else {
                        message.reply(`${shortName} could\'t be deleted! Is it really your character?`)
                    }
                })
        } catch(error) {
            message.reply(error.message)
        }
    }