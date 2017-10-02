const db = require('sqlite')

/**
 * 
 */
class Database {

    /**
     * @return {string[]}
     */
    static getSavedRaids() {
        const line = db.all('SELECT * FROM raids')
            .catch((error) => console.log(error))
        return line
    }

    /**
     * 
     * @param {string} id 
     * @param {string} name 
     * @param {string} shard 
     * @param {string} riftClass 
     * @param {string} roles 
     * @param {string} shortName
     *  
     * @return {string}
     */
    static createCharacter(id, name, shard, riftClass, roles, shortName) {
        try {
            db.get(`SELECT * FROM characters WHERE name = "${name}" AND shard = "${shard}"`).then((row) => {
                if (!row) {
                    db.run('INSERT INTO characters (userID, name, shard, riftClass, roles, shortName) VALUES (?, ?, ?, ?, ?, ?)', [id, name, shard, riftClass, roles, shortName])
                        .then(() => {
                            return 'NEW'
                        })
                } else {
                    db.run(`UPDATE characters SET riftClass = "${riftClass}", roles = "${roles}", shortName = "${shortName}" WHERE name = "${name}" AND shard = "${shard}"`)
                        .then(() => {
                            return 'UPDATE'
                        })
                }
            }).catch((error) => {
                console.log(`createCharacter: ${error}`)
                db.run('CREATE TABLE IF NOT EXISTS characters (userID TEXT, name TEXT, shard TEXT, riftClass TEXT, roles TEXT, shortName TEXT)').then(() => {
                    db.run('INSERT INTO characters (userID, name, shard, riftClass, roles, shortName) VALUES (?, ?, ?, ?, ?, ?)', [id, name, shard, riftClass, roles, shortName])
                        .then(() => {
                            return 'NEW'
                        })
                })
            })
        } catch(error) {
            console.log(`createCharacter: ${error}`)
            return 'WHATEVER'
        }
    }

    /**
     * 
     */
    static createRaid() {
        try {
            db.run('INSERT INTO raids (raidID, type, day, date) VALUES (?, ?, ?, ?, ?)', [newRaid.id, newRaid.name, newRaid.type, newRaid.day, newRaid.date])
                .catch((error) => {
                    console.log(error)
                    db.run('CREATE TABLE IF NOT EXISTS raids (raidID INTEGER, type TEXT, day TEXT, date TEXT)').then(() => {
                        db.run('INSERT INTO raids (raidID, type, day, date) VALUES (?, ?, ?, ?, ?)', [newRaid.id, newRaid.name, newRaid.type, newRaid.day, newRaid.date])
                    })
                })
        } catch(error) {
            console.log(`createRaid: ${error}`)
        }
    }
}

module.exports = Database
