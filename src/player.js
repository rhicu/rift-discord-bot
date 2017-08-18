const enums = require("./enums");

class player {
    constructor(id, ingameName, riftClass, roles) {
        this.id = id;
        this.ingameName = ingameName;
        this.riftClass = riftClass;
        this.roles = roles;
    }

    toString() {
        return `${this.ingameName} - ${this.roles} (${this.riftClass})`;
    }
}

module.exports = player;