/** */
class Time {

    /**
     * @param {String} time
     * @param {String | Number} minutes
     * @return {String}
     */
    static substractMinutesFromGivenTime(time, minutes) {
        try {
            if(typeof minutes === 'string') {
                minutes = parseInt(minutes)
            }

            const timeArray = time.split(':')
            if(timeArray.length !== 2) {
                throw new Error('Given time input has wrong format or type')
            }

            let hour = parseInt(timeArray[0])
            let minutes = parseInt(timeArray[1])

            if(minutes < 15) {
                let overflow = 15 - minutes
                minutes = 60 - overflow
                hour--
                if(hour === -1) {
                    hour = 23
                }
            } else {
                minutes = minutes -15
            }

            if(hour < 10 && hour >= 0) {
                hour = `0${hour}`
            }

            if(minutes < 10 && minutes >= 0) {
                minutes = `0${minutes}`
            }

            return `${hour}:${minutes}`
        } catch(error) {
            throw error
        }
    }

    /**
     * @param {String} dateString
     * @return {Number} - Time in Milliseconds since 01/01/1970
     */
    static getTimeInMilliseconds(dateString) {
        try {
            if(dateString === '') {
                return Date.now()
            } else {
                const dateArray = dateString.split('.')
                if (dateArray.length !== 3) {
                    throw new Error('Given time input has wrong format or type')
                } else {
                    let newDate = new Date(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`)
                    return newDate.getTime()
                }
            }
        } catch(error) {
            console.log(`getTimeInMilliseconds: ${error}`)
            throw error
        }
    }

    /**
     * @param {String} timeString
     * @return {String}
     */
    static _verifyTime(timeString) {
        return timeString
    }

    /**
     * @param {String} dateString
     * @return {Date}
     */
    static _generateDate(dateString) {
        const dateArray = dateString.split('.')
        if(dateArray.length !== 3) {
            return null
        }
        return new Date(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`)
    }
}

module.exports = Time
