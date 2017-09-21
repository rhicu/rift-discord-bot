const db = require("sqlite");

class database {
    constructor(dbPath) {
        db.open(`${dbPath}riftDiscordBot.sqlite`)
            .then(() => {
                Promise.all([
                    db.run("CREATE TABLE IF NOT EXISTS raids (raidID Integer, name TEXT, type TEXT, day TEXT, date TEXT)"),
                    db.run("CREATE TABLE IF NOT EXISTS registered (raidID INTEGER, userID TEXT, shortName TEXT)"),
                    db.run("CREATE TABLE IF NOT EXISTS confirmed (raidID INTEGER, userID TEXT, shortName TEXT)"),
                    db.run("CREATE TABLE IF NOT EXISTS data (name TEXT, intValue INTEGER, stringValue TEXT)"),
                    db.run("CREATE TABLE IF NOT EXISTS characters (userID TEXT, name TEXT, shard TEXT, riftClass TEXT, roles TEXT, shortName TEXT)")
                ]).catch(error => {
                    console.log(`adding new tables if not exist: ${error}`);
                });
            });
    }

    getSavedRaids() {
        const line = db.all("SELECT * FROM raids")
            .catch((error) => console.log(error));
        return line;
    }

    createCharacter(id, name, shard, riftClass, roles, shortName) {
        try {
            db.get(`SELECT * FROM characters WHERE name = "${name}" AND shard = "${shard}"`).then(row => {
                if (!row) {
                    db.run("INSERT INTO characters (userID, name, shard, riftClass, roles, shortName) VALUES (?, ?, ?, ?, ?, ?)", [id, name, shard, riftClass, roles, shortName])
                        .then(() => {
                            return "NEW";
                        });
                } else {
                    db.run(`UPDATE characters SET riftClass = "${riftClass}", roles = "${roles}", shortName = "${shortName}" WHERE name = "${name}" AND shard = "${shard}"`)
                        .then(() => {
                            return "UPDATE";
                        });
                }
            }).catch(error => {
                console.log(`createCharacter: ${error}`);
                db.run("CREATE TABLE IF NOT EXISTS characters (userID TEXT, name TEXT, shard TEXT, riftClass TEXT, roles TEXT, shortName TEXT)").then(() => {
                    db.run("INSERT INTO characters (userID, name, shard, riftClass, roles, shortName) VALUES (?, ?, ?, ?, ?, ?)", [id, name, shard, riftClass, roles, shortName])
                        .then(() => {
                            return "NEW";
                        });
                });
            });
        } catch(error) {
            console.log(`createCharacter: ${error}`);
            return "WHATEVER";
        }
    }
}

module.exports = database;