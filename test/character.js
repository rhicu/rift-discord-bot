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
    it('Should create a new character with Charactername: ${charName} and Owner: ${owner}', function() {
        character(charName, owner);
        console.log(character);
        assert(character.name, charName, "Charactername mismatch");
      //  assert(character.owner, owner, "Owner mismatch");
    });
  });
});

