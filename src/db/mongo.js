const MongoClient = require('mongodb').MongoClient
const url = require('../config').mongoPath

/** */
class MongoDatabase {

    /** */
    constructor() {}

    /**
     *
     * @param {Plyer} newPlayer
     *
     * @return {Boolean}
     */
    static addPlayer(newPlayer) {
        return MongoClient.connect(url)
            .then((db) => {
                return db.collection('character').insertOne(newPlayer)
                    .then((res) => {
                        db.close()
                        return true
                    }).catch((error) => {
                        console.log(error)
                    })
            }).catch((error) => {
                console.log(error)
            })
    }

    /**
     *
     * @param {String} playerID
     * @param {String} name
     *
     * @return {Player}
     */
    static getPlayer(playerID, name) {
        return MongoClient.connect(url)
            .then((db) => {
                return db.collection('character').findOne({id: `${playerID}`, shortName: `${name}`})
                    .then((result) => {
                        db.close()
                        return result
                    }).catch((error) => {
                        console.log(error)
                    })
            }).catch((error) => {
                console.log(error)
            })
    }

    /**
     *
     * @param {Raid} newRaid
     *
     * @return {Boolean}
     */
    static addPlayer(newRaid) {
        return MongoClient.connect(url)
            .then((db) => {
                return db.collection('character').insertOne(newRaid)
                    .then((res) => {
                        db.close()
                        return true
                    }).catch((error) => {
                        console.log(error)
                    })
            }).catch((error) => {
                console.log(error)
            })
    }

    /**
     *
     * @param {String} playerID
     * @param {String} name
     *
     * @return {Raid}
     */
    static getPlayer(playerID, name) {
        return MongoClient.connect(url)
            .then((db) => {
                return db.collection('character').findOne({id: `${playerID}`, shortName: `${name}`})
                    .then((result) => {
                        db.close()
                        return result
                    }).catch((error) => {
                        console.log(error)
                    })
            }).catch((error) => {
                console.log(error)
            })
    }
}

module.exports = MongoDatabase
