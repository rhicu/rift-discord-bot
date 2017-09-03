/**
 *  UNIT TESTS for /src/CharacterManager/character_manager.js
 *  The character manager module will handle all character actions.
 *  It uses a character model and stores the list of existing characters
 *
 *  @author: whitekb
 *  @date: 03.09.2017
 */

var assert = require('assert');
var characterManager = require('../src/CharacterManager/character_manager.js');
var character = require('../src/CharacterManager/character.js');                    //too lazy to write a mockup model, so I'll use the real one for now

//INIT character Manger for all tests
var charManager = new characterManager(character);

//DECLARE test data
var testCharacter1 = { charName: "Leroy Jenkins", shard: "SomeServer", owner: "JohnDoe", roles: ["Casualty", "Roadkill"], riftClass: "Berzerk" };
var testCharacter2 = { charName: "IC Weener", shard: "ForgottenRealm", owner: "JohnDoe", roles: ["DD", "Heal"], riftClass: "Noob" };
var testCharacter3 = { charName: "Poor Moe", shard: "Springfield", owner: "Fox", roles: ["Barkeep"], riftClass: "Toon" };

//we use this character to verify that duplicate characters are avoided
var faultyCharacter1 = { charName: "Leroy Jenkins", shard: "SomeServer", owner: "Nemesis", roles: ["Casualty", "Roadkill"], riftClass: "Berzerk" };
//and this one to verify that duplicate recognition is NOT case sensitive
var faultyCharacter2 = { charName: "leroy jenkins", shard: "someserver", owner: "Nemesis", roles: ["Casualty", "Roadkill"], riftClass: "Berzerk" };


describe('Character Manager', function () {
    describe('Register a Character', function () {
        it(`Should register a new character for a user. Character name: ${testCharacter1.charName} and Owner: ${testCharacter1.owner}`, function () {

            charManager.registerCharacter(testCharacter1);
            console.log(charManager.characterList);

            //assert(characterManager.characterList.length, 1, "Characterlist contains wrong amount of data");
            assert(charManager.characterList[0].charName, testCharacter1.charName, "Charactername mismatch");
            
        });
    });
    
    describe('Remove a character ', function () {
        it(`Test that a character can be removed.`, function () {

            assert.equal(true, false, "Test not yet implemented");
        });
    });
    
    describe('Update a character', function () {
        it(`Test each attribute of a character can be updated (only owner may not be changed).`, function () {
            
            assert.equal(true, false, "Test not yet implemented");
            
        });
    });

    describe('Prohibit duplicate characters', function () {
        it(`Ensure that a character full name needs to be unique`, function () {

            assert.equal(true, false, "Test not yet implemented");

        });
    });

    describe('List Characters', function () {
        it(`Returns the list of registered characters`, function () {

            assert.equal(true, false, "Test not yet implemented");            

        });
    });

    


});
