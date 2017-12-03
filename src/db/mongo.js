const MongoClient = require('mongodb').MongoClient
const url = require('../config').mongoPath

/** */
class MongoDatabase {

    /** */
    constructor() {}

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
    _updateNextRaidID(raidID) {
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
    _getRaidID() {
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
        let nextRaidID = await this._getRaidID()
        this._updateNextRaidID(nextRaidID+1)
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
     * @return {Raid[]}
     */
    static getAllRaids() {
        return MongoClient.connect(url)
            .then((db) => {
                return db.collection('raids').find({}).toArray()
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
     * @param {Raid} raid 
     */
    static addRaid(raid) {
        MongoClient.connect(url)
            .then((db) => {
                db.collection('raids').insertOne(raid)
                    .catch((error) => {
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

    /**
     *
     * @param {Raid} raid
     */
    static updateRaid(raid) {
        MongoClient.connect(url)
            .then((db) => {
                db.collection('raids').updateOne({id: `${raid.id}`}, raid)
                    .catch((error) => {
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
    static deleteRaid(raidID) {
        MongoClient.connect(url)
            .then((db) => {
                db.collection('raids').deleteOne({id: `${raidID}`})
                    .catch((error) => {
                        console.log(error)
                    })
            }).catch((error) => {
                console.log(error)
            })
    }

    /**
     *
     * @param {Player} player
     */
    static createPlayer(player) {
        MongoClient.connect(url)
            .then((db) => {
                db.collection('player').insertOne(player)
                    .catch((error) => {
                        console.log(error)
                    })
            }).catch((error) => {
                console.log(error)
            })
    }

    /**
     *
     * @param {String} playerID
     * @param {String} shortName
     *
     * @return {Player}
     */
    static getPlayer(playerID, shortName) {
        return MongoClient.connect(url)
            .then((db) => {
                return db.collection('player').findOne({id: `${playerID}`, shortName: `${shortName}`})
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
