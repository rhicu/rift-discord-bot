const util = require('../util')
// const Player = require('../player')
// const enums = require('../enums')
// const config = require('../config.json')
const N = '\n'

/** */
class Raid {

    /**
     * 
     * @param {String} type
     * @param {Date} date
     * @param {String} start
     * @param {String} end
     * @param {String} raidLead
     */
    constructor(type, date, start, end, raidLead) {

        this.type = type
        this.date = date.toDateString()
        this.start = start
        this.end = end
        this.invite = this._calculateInviteTime(start)
        this.raidLead = raidLead
        this.id = 0
        this.prio = date.getTime()
        this.messageID = ''
        this.registeredPlayer = []
        this.confirmedPlayer = []
    }

    /**
     * 
     * @return {Number}
     */
    get id() {
        return this.id
    }

    /**
     * 
     * @param {Number} raidID
     */
    set id(raidID) {
        this.id = raidID
    }

    /**
     * @return {String}
     */
    generateRaidOutput() {
        const plannedRaids = `${this.name} - ${this.day}, ${this.date}${
            N}AnmeldeID: ${this.id}${N}${
            N}Raidlead: ${this.raidlead}${N}${
            N}Raidinvite: ${this.invite}${
            N}Raidstart: ${this.start} - Raidende : ${this.end}${
            N}${
            N}Vorraussetzung:${
            N}${util.multiLineStringFromArray(this.config.requirements)}${
            N}Insgesamt verfügbare Plätze: ${this.config.numberPlayer}${
            N}${
            N}Benötigt: ${this.config.numberTank}x Tank, ${this.config.numberHeal}x Heal, ${this.config.numberSupport}x Supp, ${this.config.numberDD}x DD${
            N}${
            N}Angemeldet:${
            N}${util.numberedMultiLineStringFromArray(this.registeredPlayer)}${
            N}Bestätigt:${
            N}${util.numberedMultiLineStringFromArray(this.confirmedPlayer)}`
        return plannedRaids
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
