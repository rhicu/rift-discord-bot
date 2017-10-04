const config = require("../config.json");
const Raid = require("./raid");

class RaidFactory {
    constructor() {}
    /**
     * 
     * @param {string} input
     * 
     * @return {Raid}
     */
    newRaid(input) {
        const args = input.split(' ').splice(1);
        const type = this._getType(input);
        if(type) {
            return new Raid(type);
        } else {
            return null;
        }
    }

    /**
     * 
     * @param {string} input 
     */
    _getType(input) {
        if(input === 'irotp') return input
        else if(input === 'td') return input
        else return null
    }
}

module.exports = RaidFactory