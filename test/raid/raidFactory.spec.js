const Raid = require('../../src/raid/raidNew')
const RaidFactory = require('../../src/raid/raidFactory')

const factory = new RaidFactory()

describe('testing newRaid()', () => {

    test('should return null with wrong input', () => {
        expect(factory.newRaid('bla')).toBe(null)
    })

    test('should return a new irotp Raid object with correct input', () => {
        const date = new Date('2017-10-23')
        const args = ['irotp', '23.10.2017']
        expect(factory.newRaid(args, 'icke')).toEqual(new Raid('irotp', date, '19:00', '21:30', 'icke'))
    })

    test('should return a new td Raid object with correct input', () => {
        const date = new Date('2017-10-23')
        const args = ['td', '23.10.2017', '22:00', '23:00']
        expect(factory.newRaid(args, 'du')).toEqual(new Raid('td', date, '22:00', '23:00', 'du'))
    })
})
