/**
 *  This module contains the basic character model for RIFT
 *  It is used to instantiate characters
 *
 *  @author: whitekb
 *  @date: 21.08.2017
 *
 */

//Public
module.exports = RiftCharacter;
function RiftCharacter(n, acc) {
    this.name = n;
    this.owner = acc;
    this.roles = [];
}

RiftCharacter.prototype = {
  setShard: function (shard) {
    this.shard = shard;
  },
  setRoles: function (roles) {
    this.roles = roles;
  },
  addRole: function (role) {
    this.roles.push(role);
  },
  clearRoles: function () {
    this.roles = [];
  },
  setClass: function (riftClass) {
    this.riftClass = riftClass;
  },
  toJSON: function() {
    return JSON.stringify(this);
  },
  toString: function(){
    var charAsString = "";
    charAsString = "Character: " + this.name + "@" this.shard "\n";
    charAsString = "Player: " + this.owner + "\n";
    charAsString = "Roles: " + this.riftClass + "\n";
    charAsString = "Roles: " + this.roles.join(", ") + "\n";

    return charAsString;
  }
  store: function(){
    //stub for persisting characters when MongoDB is available ;-)
  }

};
