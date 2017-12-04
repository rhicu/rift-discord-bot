const MongoClient = require('mongodb').MongoClient
const Raid = require('../raid/raid')
const Player = require('../player')
const url = require('../config').mongoPath

/** */
class MongoDatabase {

    /** */
    constructor() {}

    /**
     *
     * @param {Raid} newCharacter
     *
     * @return {Boolean}
     */
    static addPlayer(newCharacter) {
        return MongoClient.connect(url)
            .then((db) => {
                return db.collection('character').insertOne(newCharacter)
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
                        if(result) {
                            let newPlayer = new Player(result.id, result.ingameName, result.riftClass, result.roles, result. shortName)
                            return newPlayer
                        } else {
                            return null
                        }
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
    static _updateNextRaidID(raidID) {
        console.log('update to raidID: ' + raidID)
        MongoClient.connect(url)
            .then((db) => {
                db.collection('data').updateOne({name: 'raidID'}, {$set: {value: raidID}})
                    .then((result) => {
                        db.close()
                        if(result.result.n === 0) {
                            MongoDatabase._createNewDataObject({name: 'raidID', value: raidID})
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }).catch((error) => {
                console.log(error)
            })
    }

    /**
     *
     * @param {Object} object
     */
    static _createNewDataObject(object) {
        MongoClient.connect(url)
            .then((db) => {
                db.collection('data').insertOne(object)
                    .then(() => {
                        db.close()
                    }).catch((error) => {
                        console.log(error)
                    })
            }).catch((error) => {
                console.log(error)
            })
    }

    /**
     * @return {Number}
     */
    static _getRaidID() {
        // look for raidID
        return MongoClient.connect(url)
            .then((db) => {
                return db.collection('data').findOne({name: 'raidID'})
                    .then((result) => {
                        db.close()
                        if(result)
                            return result.value
                        else {
                            return 1000
                        }
                    })
            }).catch((error) => {
                console.log(error)
            })
    }

    /**
     * @return {Number}
     */
    static async getNextRaidID() {
        let nextRaidID = await MongoDatabase._getRaidID()
        console.log('next raidID: ' + nextRaidID)
        MongoDatabase._updateNextRaidID(nextRaidID+1)
        return nextRaidID
    }

    /**
     * @return {Number[]}
     */
    static getRaidIDs() {
        return MongoClient.connect(url)
            .then((db) => {
                return db.collection('raids').find({}).toArray()
                    .then((array) => {
                        return array.map((raid) => {
                            return raid.id
                        })
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
                    .then((results) => {
                        db.close()
                        if(results) {
                            let raidArray = []
                            results.forEach((result) => {
                                let newRaid = new Raid(result.id, result. type, new Date(result.date), result.start, result.end, result.raidLead, result.messageID)
                                raidArray.push(newRaid)
                            })
                            return raidArray
                        } else {
                            return null
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
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
                return db.collection('raids').findOne({id: raidID})
                    .then((result) => {
                        db.close()
                        if(result) {
                            let newRaid = new Raid(result.id, result. type, new Date(result.date), result.start, result.end, result.raidLead, result.messageID)
                            return newRaid
                        } else {
                            return null
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
            })
    }

    /**
     *
     * @param {Raid} raid
     *
     * @return {Boolean}
     */
    static updateRaid(raid) {
        return MongoClient.connect(url)
            .then((db) => {
                return db.collection('raids').updateOne({id: raid.id}, {$set: raid})
                    .then(() => {
                        db.close()
                        return true
                    }).catch((error) => {
                        console.log(error)
                        return false
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
        console.log('Löschen ja?')
        MongoClient.connect(url)
            .then((db) => {
                db.collection('raids').deleteOne({id: raidID})
                    .then((result) => {
                        db.close()
                    }).catch((error) => {
                        console.log(error)
                    })
            }).catch((error) => {
                console.log(error)
            })
    }
}

module.exports = MongoDatabase
