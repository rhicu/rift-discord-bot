const Raid = require('../../src/raid/raidNew')

describe('testing _calculateInviteTime', () => {

    test('should return "18:45"', () => {
        expect(Raid.prototype._calculateInviteTime('19:00')).toBe('18:45')
    })

    test('should return "23:45"', () => {
        expect(Raid.prototype._calculateInviteTime('00:00')).toBe('23:45')
    })

    test('should return "18:00"', () => {
        expect(Raid.prototype._calculateInviteTime('18:15')).toBe('18:00')
    })

    test('should return "21:52"', () => {
        expect(Raid.prototype._calculateInviteTime('22:07')).toBe('21:52')
    })

    test('should return "01:48"', () => {
        expect(Raid.prototype._calculateInviteTime('02:03')).toBe('01:48')
    })

    test('should return "02:03"', () => {
        expect(Raid.prototype._calculateInviteTime('02:18')).toBe('02:03')
    })
})
