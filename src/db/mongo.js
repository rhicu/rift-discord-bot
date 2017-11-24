const MongoClient = require('mongodb').MongoClient
const url = require('../config').mongoPath

/**
 *
 */
class Database {

    /**
     * @return {Number}
     */
    static getNextRaidID() {
        // look for raidID and save it again incremented by 1
        const raidID = MongoClient.connect(url)
            .then((db) => {
                db.collections('data').find({raidID})
                    .then()
                db.close()
            }).catch((error) => {
                console.log(error)
            })

        // return raid ID
        return raidID
    }
}

module.exports = Database

