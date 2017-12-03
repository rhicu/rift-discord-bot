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
    static _getRaidID() {
        // look for raidID and save it again incremented by 1
        return MongoClient.connect(url)
            .then((db) => {
                return db.collection('data').findOne({name: 'raidID'})
                    .then((result) => {
                        db.close()
                        if(result)
                            return result.value
                        else
                            return 1000
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
        return MongoDatabase.getRaidIDs()
            .then((raidIDArray) => {
                if(raidIDArray) {
                    let raidArray = []
                    raidIDArray.forEach((raidID) => {
                        let newRaid = MongoDatabase.getRaid(raidID)
                        raidArray.push(newRaid)
                    })
                    return raidIDArray
                } else {
                    return null
                }
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
                        if(result) {
                            let newRaid = new Raid(result.id, result. type, result.date, result.start, result.end, result.raidLead)
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
}

module.exports = MongoDatabase
