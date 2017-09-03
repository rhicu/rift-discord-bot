/**
 *  This module handles all operations on characters
 *  In the current version the available characters are stored in an object.
 *  (as long as no persistency layer is established)
 *
 *  @author: whitekb
 *  @date: 21.08.2017
 *
 */

class CharacterManager {
    constructor(option){
        this.characterModel = option;
        this.characterList = [];
    }

    registerCharacter(characterData) {
        var character = new this.characterModel(characterData.charName, characterData.owner);
        character.setShard(characterData.shard);
        character.setRoles(characterData.roles);
        character.setClass(characterData.riftClass);

        this.characterList.push(character);

        //also store the character in the database

    }

    removeCharacter(fullName) {
        _.remove(characterList, function (n) {
            return n.fullName === fullName;
        });
    }


    updateCharacter(action, characterData) {
        //find the character

        character.setShard(characterData.shard);
        character.setRoles(characterData.roles);
        character.setClass(characterData.class);
    }

    getListOfCharacters(owner = null) {
        var result = [];
        if (owner != null) {
            //find all characters of this owner
            result = _.filter(users, ['owner', owner]);
        } else {
            result = this.characterList;
        }
        
    }

}

    module.exports = CharacterManager