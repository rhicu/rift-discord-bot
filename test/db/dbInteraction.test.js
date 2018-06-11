const DBInteraction = require('../../src/db/dbInteraction')
const db = require('sqlite')

db.open('../testingData/testdb.sqlite')
    .catch((error) => {
        console.log(error)
    })

describe('testing saveRaid()', () => {

    test('should return true', () => {
        expect(true).toBe(true)
    })
})
