/**
 *  This module contains the basic character model for RIFT
 *  It is used to instantiate characters
 *
 *  @author: whitekb
 *  @date: 21.08.2017
 *
 */

class riftCharacter{
    constructor(cName, playerName){
        this.charName = cName;
        this.owner = playerName;
    }

    setShard(shard){
        this.shard = shard;
    }

    setRoles(roles) {
        this.roles = roles;
    }

    addRole(role) {
        this.roles.push(role);
    }

    removeRole(role){
        var index = this.roles.indexOf(role);
        if(index != -1){
            this.roles.splice(index, 1);
        }

    }

    clearRoles() {
        this.roles = [];
    }



    setClass(riftClass) {
        this.riftClass = riftClass;
    }

    toJSON() {
        return JSON.stringify(this);
    }

    toString(){
        var charAsString = "";
        charAsString = "Character: ${this.charName}@${this.shard}\n"
            + "Player: ${this.owner}\n"
            + "Roles: ${this.riftClass}\n"
            + "Roles: ${this.roles.join(", ")}\n";

        return charAsString;
    }

    store(){
        //stub for persisting characters when MongoDB is available ;-)
    }

}

module.exports = riftCharacter;