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

            messageArray.forEach((message) => {
                if(message.id)
            })
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
}

module.exports = MessageHandler
