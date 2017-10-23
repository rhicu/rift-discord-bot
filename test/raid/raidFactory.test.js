const Raid = require('../../src/raid/raidNew')
const RaidFactory = require('../../src/raid/raidFactory')

const factory = new RaidFactory()

describe('testing _getType()', () => {

    test('should return null with number input ("8")', () => {
        expect(factory._getType('8')).toBe(null)
    })

    test('should return null with empty string input ("")', () => {
        expect(factory._getType('')).toBe(null)
    })

    test('should return null with invalid string input ("bla")', () => {
        expect(factory._getType('bla')).toBe(null)
    })

    test('should return null with invalid string input ("irot")', () => {
        expect(factory._getType('irot')).toBe(null)
    })

    test('should return null with invalid string input ("irotpa")', () => {
        expect(factory._getType('irotpa')).toBe(null)
    })

    test('should return "irotp" with correct input ("irotp")', () => {
        expect(factory._getType('irotp')).toBe('irotp')
    })

    test('should return "irotp" with correct input ("phönix")', () => {
        expect(factory._getType('phönix')).toBe('irotp')
    })

    test('should return "td" with correct input ("td")', () => {
        expect(factory._getType('td')).toBe('td')
    })

    test('should return "td" with correct input ("Tartarische Tiefen")', () => {
        expect(factory._getType('Tartarische Tiefen')).toBe('td')
    })
})

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
