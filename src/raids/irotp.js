const util = require("../util");
const config = require("../config.json");
const player = require("../player");

class irotp {
    constructor() {
        var configPath = config.raids.irotp;
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
${util.multiLineStringFromArray(config.raids.irotp.requirements)}
Insgesamt verfügbare Plätze: ${config.raids.irotp.numberPlayer}

Benötigt: ${config.raids.irotp.numberTank}x Tank, ${config.raids.irotp.numberHeal}x Heal, ${config.raids.irotp.numberSupport}x Supp, ${config.raids.irotp.numberDD}x DD

Angemeldet:
${util.multiLineStringFromPlayerArray(this.registeredPlayer)}`;
        return plannedRaids;
    }
}

module.exports = irotp;