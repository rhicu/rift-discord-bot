const util = require('../util/util')
const RichEmbed = require('discord.js').RichEmbed
const config = require('./raidConfig')
const N = '\n'

/** */
class Raid {

    /**
     * @param {String} type
     * @param {String} start
     * @param {String} end
     * @param {String} raidLeadName
     * @param {String} messageID
     * @param {Object} member
     * @param {Object} recurring
     * @param {Object} recurringMember
     * @param {Boolean} isMainRaid
     * @param {Boolean} shouldBeDisplay
     */
    constructor(type, start, end, raidLeadName, messageID, member, recurring, recurringMember, isMainRaid, shouldBeDisplay) {
        this.type = type
        this.start = start
        this.end = end
        this.raidLead = raidLeadName
        this.messageID = messageID
        this.member = member
        this.recurring = recurring
        this.recurringMember = recurringMember
        this.isMainRaid = isMainRaid
        this.shouldBeDisplay = shouldBeDisplay

        this.invite = this._calculateInviteTime(start)
    }

    /**
     * @return {Number}
     */
    getPrio() {
        return this.start.toDateString().getTime()
    }

    /**
     * @return {String}
     */
    _generateRaidOutput() {
        return `${config.raids[this.type].name} - ${this.start.toDateString()}${
            N}AnmeldeID: ${this.planerID}${N}${
            N}Raidlead: ${this.raidLead}${N}${
            N}Raidinvite: ${this.invite}${
            N}Raidstart: ${this.start} - Raidende : ${this.end}${
            N}${
            N}Insgesamt verfügbare Plätze: ${config.raids[this.type].numberPlayer}${
            N}Benötigt: ${config.raids[this.type].numberTank}x Tank, ${config.raids[this.type].numberHeal}x Heal, ${config.raids[this.type].numberSupport}x Supp, ${config.raids[this.type].numberDD}x DD`
    }

    /**
     * @return {RichEmbed}
     */
    generateEmbed() {
        try {
            let embed = new RichEmbed()
                .attachFile(config.raids[this.type].imgPath)
                .setTitle(config.raids[this.type].name)
                .addField('Daten:', this._generateRaidOutput())
                .addField('Vorraussetzungen:', this._checkForEmptyStrings(util.multiLineStringFromArray(config.raids[this.type].requirements)))
                .addField('Angemeldet:', this._checkForEmptyStrings(util.numberedMultiLineStringFromArray(this.registeredPlayer)))
                .addField('Bestätigt:', this._checkForEmptyStrings(util.numberedMultiLineStringFromArray(this.confirmedPlayer)))
                .setFooter('Registrierung via RiftDiscordBot')
                .setColor(config.raids[this.type].embedColor)
            return embed
        } catch(error) {
            console.log(`generateEmbed: ${error.stack}`)
        }
    }

    /**
     *
     * @param {String} input
     *
     * @return {String}
     */
    _checkForEmptyStrings(input) {
        if(input === '') {
            return '...'
        } else {
            return input
        }
    }

    /**
     *
     * @param {String} start
     *
     * @return {String}
     */
    _calculateInviteTime(start) {
        const timeArray = start.split(':')
        let hour = parseInt(timeArray[0])
        let minutes = parseInt(timeArray[1])

        if(minutes < 15) {
            let overflow = 15 - minutes
            minutes = 60 - overflow
            hour--
            if(hour === -1)
                hour = 23
        } else
            minutes = minutes -15

        if(hour < 10 && hour >= 0)
            hour = `0${hour}`
        if(minutes < 10 && minutes >= 0)
            minutes = `0${minutes}`

        return `${hour}:${minutes}`
    }
}

module.exports = Raid
