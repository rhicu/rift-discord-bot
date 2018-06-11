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
            bot.database.getRaidsToPrint()
            // MessageHandler._getPrintedRaids()
        ]).then((results) => {
            const raidArray = results[0]
            // const messageArray = results[1]
            // let counter = 0

            // for(let index = 0; index < messageArray.length; index++) {
            //     const message = messageArray[index]
            //     if(raidArray[index] && raidArray[index].messageID === message.id) {
            //         MessageHandler._updatePrintedRaid(message, raidArray[index])
            //     } else if(raidArray[index] && raidArray[index].messageID !== message.id) {
            //         counter = index
            //         break
            //     }
            // }

            // for(let index = counter; index < messageArray.length; index++) {
            //     messageArray[index].delete()
            // }

            // for(let index = counter; index < raidArray.length; index++) {
            //     MessageHandler._printRaid(raidArray[index], bot)
            // }

            MessageHandler.clearRaidPlanerChannel(bot)
                .then(() => {
                    raidArray.forEach((raid) => {
                        MessageHandler._printRaid(bot, raid)
                    })
                })
        })
    }

    /**
     * @public
     * @param {Client} bot
     * @param {String} channelName
     */
    static clearChannel(bot, channelName) {
        const channel = MessageHandler._getChannelByName(bot, channelName)
        channel.fetchMessages()
            .then((messages) => {
                messages.deleteAll()
            })
    }

    /**
     * @public
     * @param {Client} bot
     * @param {String} channelName
     * @return {Promise}
     */
    static clearRaidPlanerChannel(bot) {
        const channel = MessageHandler._getRaidPlannerChannel(bot)
        return channel.fetchMessages()
            .then((messages) => {
                messages.deleteAll()
            })
    }

    /**
     * @param {Client} bot
     * @param {String} messageID
     * @return {Message}
     */
    static _getPrintedRaid(bot, messageID) {
        const channel = MessageHandler._getRaidPlannerChannel(bot)
        return channel.fetchMessage(messageID)
    }

    /**
     * @private
     * @param {Client} bot
     * @return {Mesage[]}
     */
    static _getPrintedRaids(bot) {
        const channel = MessageHandler._getRaidPlannerChannel(bot)
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
     * @param {Client} bot
     * @param {String} channelName
     * @return {TextChannel}
     */
    static _getChannelByName(bot, channelName) {
        return bot.guilds.find('id', config.serverID).channels.find('name', channelName)
    }

    /**
     * @param {Client} bot
     * @param {Raid} raid
     */
    static updatePrintedRaid(bot, raid) {
        this._getPrintedRaid(bot, raid.messageID)
            .then((message) => {
                this._updatePrintedRaid(message, raid)
            })
    }

    /**
     * @private
     * @param {Message} message
     * @param {Raid} raid
     */
    static _updatePrintedRaid(message, raid) {
        const embed = raid.generateEmbed()
        message.edit({embed})
    }

    /**
     * @private
     * @param {Client} bot
     * @param {Raid} raid
     */
    static _printRaid(bot, raid) {
        const embed = raid.generateEmbed()
        const channel = MessageHandler._getRaidPlannerChannel(bot)

        channel.send({embed})
            .then((message) => {
                raid.messageID = message.id
                bot.database.addOrUpdateRaid(raid)
            })
    }
}

module.exports = MessageHandler
