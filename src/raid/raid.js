const util = require('../utils/util')
const config = require('../config.json')
const N = '\n'

/**
 * 
 */
class Raid {

    /**
     * 
     * @param {string} type 
     * @param {string} day 
     * @param {string} date 
     * @param {string} invite 
     * @param {string} start 
     * @param {string} end 
     */
    constructor(type, day, date, invite = '18:45', start = '19:00', end = '21:30') {

        switch(type) {
            case 'irotp':
                this.config = config.raids.irotp
                break
            case 'td':
                this.config = config.raids.td
                break
            default:
                this.config = config.raids.td
                return
        }

        this.type = type
        this.day = day
        this.date = date
        this.invite = invite
        this.start = start
        this.end = end
        this.img = this.config.imgPath
        this.name = this.config.name
        this.shortName = this.config.shortName
        this.embedColor = this.config.embedColor
        this.registeredPlayer = []
        this.confirmedPlayer = []
        this.messageID = ''
        this.id = 0
    }

    /**
     * @return {string}
     */
    isValid() {
        return (this.day !== '' && this.date !== '' && this.invite !== '' && this.start !== '' && this.end !== '')
    }

    /**
     * @return {string} 
     */
    generateRaidOutput() {
        const plannedRaids = `${this.name} - ${this.day}, ${this.date}${
            N}AnmeldeID: ${this.id}${N}${
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
}

module.exports = Raid
