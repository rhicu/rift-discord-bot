/** */
class Database {

    /** */
    constructor() {}

    /**
     * 
     * @param {sqlite} db
     * @param {String} id
     * @param {String} shortName
     * 
     * @return {Object}
     */
    static getPlayerFormDataBase(db, id, shortName) {
        return db.get(`SELECT * FROM characters WHERE userID ="${id}" AND shortName = "${shortName}"`).then((row) => {
            if (!row) {
                return null
            } else {
                return row
            }
        }).catch(() => {
            console.error
            return null
        })
    }
}

module.exports = Database
