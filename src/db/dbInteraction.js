"use strict";
 
const player = require("./player");

function createPlayerFormDataBase(string) {
    const message = string.split(" ");
    (async() => {
        try {
            await db.open(`${config.dbPath}riftCharacter.sqlite`);
            await db.get(`SELECT * FROM characters WHERE userID ="${msg.author.id}"`).then(row => {
                    if (!row) {
                        return msg.reply("(1) No characters created yet! Please use 'create <name+shard> <class> <roles>' first!");
                    } else {
                        const newPlayer = new player(row.id , row.name, row.riftClass, row.roles);
                    }
                }).catch(() => {
                    console.error;
                    msg.reply("(2) No characters created yet! Please use 'create <name+shard> <class> <roles>' first!");
                });
            await db.close();
            return new player(id , ingameName, riftClass, roles);
        } catch(error) {
            console.log(`newCharacter: ${error}`);
            msg.reply("Unable to handle database");
            return;
        };
    })();
}