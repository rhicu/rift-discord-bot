const util = require("../util");
const config = require("../config.json");
const player = require("../player");

class td {
    constructor() {
        var configPath = config.raids.td;
        this.day = "Mittwoch";
        this.date = "16.08.2017";
        this.invite = "18:45";
        this.start = "19:00";
        this.end = "21:00";
        this.img = configPath.imgPath;
        this.name = configPath.name;
        this.shortName = configPath.shortName;
        this.embedColor = configPath.embedColor;
        this.registeredPlayer = [];
        this.messageID = "";
    }

    generateRaidOutput() {
        var plannedRaids =  `${this.name} - ${this.day}, ${this.date}

Raidinvite: ${this.invite}
Raidstart: ${this.start} - Raidende : ${this.end}

Vorraussetzung:
${util.multiLineStringFromArray(config.raids.td.requirements)}
Insgesamt verfügbare Plätze: ${config.raids.td.numberPlayer}

Benötigt: ${config.raids.td.numberTank}x Tank, ${config.raids.td.numberHeal}x Heal, ${config.raids.td.numberSupport}x Supp, ${config.raids.td.numberDD}x DD

Angemeldet:
${util.multiLineStringFromArray(this.registeredPlayer)}`;
        return plannedRaids;
    }
}

module.exports = td;