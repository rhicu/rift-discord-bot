let DBInteraction

beforeAll(() => {
    DBInteraction = require('../../src/db/dbInteraction')
    return DBInteraction.init()
})

describe('testing Player interactions', () => {
    let playerObject

    beforeEach(() => {
        return playerObject = {
            discordID: '007',
            ingameName: 'bla@blubb',
            riftClass: 'warrior',
            roles: {
                tank: true,
                dd: true,
                heal: false,
                support: true
            },
            shortName: 'bla'
        }
    })

    describe('testing addOrUpdatePlayer()', () => {

        test('should not return error with correct input', () => {
            expect(DBInteraction.addOrUpdatePlayer(playerObject)).not.toThrowError('This character has already been created by another person!')
        })

        test('should return error with wrong input', () => {
            expect(DBInteraction.addOrUpdatePlayer(playerObject)).toThrowError('This character has already been created by another person!')
        })
    })
})
