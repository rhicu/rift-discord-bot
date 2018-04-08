const config = require('../config.json')
// const N = '\n'

/** */
class MessageHandler {

    /**
     * @public
     * @param {Client} bot
     */
    static updatePrintedRaids(bot) {
        Promise.all([
            bot.database.getRaidsToPrint(),
            MessageHandler._getPrintedRaids()
        ]).then((results) => {
            const raidArray = results[0]
            const messageArray = results[1]
            let counter = 0

            for(let index = 0; index < messageArray.length; index++) {
                const message = messageArray[index]
                if(raidArray[index] && raidArray[index].messageID === message.id) {
                    MessageHandler._updatePrintedRaid(message, raidArray[index])
                } else if(raidArray[index] && raidArray[index].messageID !== message.id) {
                    counter = index
                    break
                }
            }

            for(let index = counter; index < messageArray.length; index++) {
                messageArray[index].delete()
            }

            for(let index = counter; index < raidArray.length; index++) {
                MessageHandler._printRaid(raidArray[index], bot)
            }
        }).catch((error) => {
            throw error
        })
    }

    /**
     * @private
     * @param {Client} bot
     * @return {Mesage[]}
     */
    static _getPrintedRaids(bot) {
        const channel = MessageHandler._getRaidPlannerChannel()
        return channel.fetchMessages()
    }

    /**
     * @private
     * @param {Client} bot
     * @return {TextChannel}
     */
    static _getRaidPlannerChannel(bot) {
        return bot.guilds.find('id', config.serverID).channels.find('id', config.raidPlannerChannelID)
    }

    /**
     * @private
     * @param {Message} message
     * @param {Raid} raid
     */
    static _updatePrintedRaid(message, raid) {
        raid.generateEmbed()
            .then((embed) => {
                message.edit({embed})
            })
    }

    /**
     * @private
     * @param {Raid} raid
     * @param {Client} bot
     */
    static _printRaid(raid, bot) {
        const embed = raid.generateEmbed()
        const channel = MessageHandler._getRaidPlannerChannel()

        channel.send({embed})
            .then((message) => {
                raid.messageID = message.id
                bot.database.addOrUpdateRaid(raid)
            })
    }
}

module.exports = MessageHandler
