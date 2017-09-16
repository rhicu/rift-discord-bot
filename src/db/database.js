const db = require("sqlite");
const config = require("../config");

class database {
    constructor() {
        async () => {
            await db.open(`${config.dbPath}riftDiscordBot.sqlite`);
            await Promise.all([
                db.run("CREATE TABLE IF NOT EXISTS raids (raidID Integer, name TEXT, type TEXT, day TEXT, date TEXT)"),
                db.run("CREATE TABLE IF NOT EXISTS registered (raidID INTEGER, userID TEXT, shortName TEXT)"),
                db.run("CREATE TABLE IF NOT EXISTS confirmed (raidID INTEGER, userID TEXT, shortName TEXT)"),
                db.run("CREATE TABLE IF NOT EXISTS data (name TEXT, intValue INTEGER, stringValue TEXT)")
            ]);
            
        }
    }

    getSavedRaids() {
        return db.all(`SELECT * FROM raids`)
            .catch((error) => console.log(error));
    }
}