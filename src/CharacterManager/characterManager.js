/**
 *  This module handles all operations on characters
 *  In the current version the available characters are stored in an object.
 *  (as long as no persistency layer is established)
 *
 *  @author: whitekb
 *  @date: 21.08.2017
 *
 */


 module.exports = CharacterManager;

 //use dependency injection to decouple the manager from the character model
 function CharacterManager(options) {
   this.options = options;
 }

 CharacterManager.prototype = {

  function(teamId) {
   return this.options.User.find({teamId: teamId})
 }