/**
 *  UNIT TESTS for /src/CharacterManager/character.js
 *  As the character.js is only a simple datamodel module,
 *  we only do some basic tests on setting and getting properties.
 *
 *  @author: whitekb
 *  @date: 22.08.2017
 */

var assert = require('assert');
var character = require('../src/CharacterManager/character.js');

//data for character tests
var charName = "Leroy Jenkins";
var shard = "SomeServer";
var owner = "JohnDoe";
var roles = ["Casualty", "Roadkill"];
var charClass = "Berzerk";

describe('Character', function() {
    describe('Create Character', function() {
        it(`Should create a new character with Charactername: ${charName} and Owner: ${owner}`, function () {
            var testChar = new character(charName, owner);
            console.log(testChar.charName);
            assert(testChar.charName, charName, "Charactername mismatch");
            assert(testChar.owner, owner, "Owner mismatch");
        });
    });

    describe('Set Shard', function () {
        it(`Should set the Shard of a character to: ${shard}`, function () {
            var testChar = new character(charName, owner);
            testChar.setShard(shard);
            assert(testChar.shard, shard, "Shard mismatch");            
        });
    });

    describe('Add Roles', function () {
        it(`Should add a list of roles: ${roles.toString()}`, function () {
            var testChar = new character(charName, owner);
            testChar.setRoles(roles);
            assert.deepEqual(testChar.roles, roles, "List of Roles mismatch");
        });
    });

    describe('Clear Roles', function () {
        it(`Should clear the list of roles`, function () {
            var testChar = new character(charName, owner);
            testChar.setRoles(roles);
            testChar.clearRoles();
            assert.deepEqual(testChar.roles, [], "List of Roles not cleared");
        });
    });

    describe('Remove a Role', function () {
        it(`Should remove one role from the list of roles`, function () {
            var expectedArray = ["Roadkill"];
            var testChar = new character(charName, owner);
            testChar.setRoles(roles);
            testChar.removeRole("Casualty");
            
            assert.deepEqual(testChar.roles, expectedArray, "Role not removed");
        });
    });

    describe('Add a Role', function () {
        it(`Should add one role to the list of roles`, function () {
            roles.push("TestRole");     //add role to expect array
            var testChar = new character(charName, owner);
            testChar.setRoles(roles);
            testChar.addRole("TestRole");
            assert.deepEqual(testChar.roles, roles, "Role not added");
        });
    });

    describe('Avoid duplicate Roles', function () {
        it(`Should check adding duplicte roles is avoided`, function () {
            
            var testChar = new character(charName, owner);
            testChar.setRoles(roles);
            testChar.addRole(roles[0]);
            assert(testChar.roles.length, roles.length, "Duplicate Role added");
        });
    });


});

