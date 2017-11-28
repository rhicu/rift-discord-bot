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

    /**
     *
     * @param {Number} raidID
     */
    static updateRaidID(raidID) {
        MongoClient.connect(url)
            .then((db) => {
                db.collection('data').updateOne({name: 'raidID'}, {value: `${raidID}`})
                    .catch((error) => {
                        console.log(error)
                    })
            }).catch((error) => {
                console.log(error)
            })
    }

    /**
     * @return {Number}
     */
    static getRaidID() {
        // look for raidID and save it again incremented by 1
        return MongoClient.connect(url)
            .then((db) => {
                return db.collection('data').findOne({name: 'raidID'})
                    .then((result) => {
                        db.close()
                        return result.value
                    })
            }).catch((error) => {
                console.log(error)
            })
    }

    /**
     * @return {Number}
     */
    static async getNextRaidID() {
        let nextRaidID = await this.getRaidID()
        this.updateRaidID(nextRaidID+1)
        return nextRaidID
    }

    /**
     * @return {Number[]}
     */
    static getRaidIDs() {
        return MongoClient.connect(url)
            .then((db) => {
                return db.collection('raids').find({}).toArray()
                    .map((raid) => {
                        return raid.id
                    }).then((result) => {
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
     * @param {Number} raidID
     *
     * @return {Raid}
     */
    static getRaid(raidID) {
        return MongoClient.connect(url)
            .then((db) => {
                return db.collection('raids').findOne({id: `${raidID}`})
                    .then((result) => {
                        db.close()
                        return result
                    }).catch((error) => {
                        console.log(error)
                    })
            })
    }
}

module.exports = MongoDatabase
