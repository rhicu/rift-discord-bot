const util = require("./util");
const player = require("./player");
const enums = require("./enums");
const config = require("./config.json");
const N = "\n";

class raid {
    constructor(type) {

        switch(type) {
            case "irotp":
                this.config = config.raids.irotp;
                break;
            case "td":
                this.config = config.raids.td;
                break;
            default:
                this.config = config.raids.td;
                return;
        }
        this.type = type;
        this.day = "";
        this.date = "";
        this.invite = "18:45";
        this.start = "19:00";
        this.end = "21:30";
        this.img = this.config.imgPath;
        this.name = this.config.name;
        this.shortName = this.config.shortName;
        this.embedColor = this.config.embedColor;
        this.registeredPlayer = [];
        this.messageID = "";
    }

    isValid() {
        return (this.day !== "" && this.date !== "" && this.invite !== "" && this.start !== "" && this.end !== "");
    }

    generateRaidOutput() {
        const plannedRaids = `${this.name} - ${this.day}, ${this.date}${
                            N}${
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
                            N}${util.multiLineStringFromArray(this.registeredPlayer)}`;
        return plannedRaids;
    }
}

module.exports = raid;