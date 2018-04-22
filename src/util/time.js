/** */
class Time {

    /**
     * @param {Date} time
     * @param {String | Number} minutes
     * @return {String}
     */
    static substractMinutesFromGivenTime(time, minutes) {
        try {
            if(typeof minutes === 'string') {
                minutes = parseInt(minutes)
            }

            const MS_PER_MINUTE = 60000
            const currentTimeInMilliseconds = time.valueOf()

            const newTimeInMilliseconds = currentTimeInMilliseconds - (MS_PER_MINUTE * minutes)

            return new Date(newTimeInMilliseconds)
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
     * @private
     * @param {String} timeString
     * @return {String}
     */
    static _verifyTime(timeString) {
        const timeArray = timeString.split(':')
        if(timeArray.length !== 2) {
            return null
        }
        return `${timeArray[0]}:${timeArray[1]}`
    }

    /**
     * @private
     * @param {String} dateString
     * @return {String}
     */
    static _transformDateStringFromGermanToUSStyle(dateString) {
        const dateArray = dateString.split('.')
        if(dateArray.length !== 3) {
            return null
        }
        return `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`
    }

    /**
     * @public
     * @param {String} dateString
     * @param {String} timeString
     * @return {Date}
     */
    static getDateFromGermanDateAndTimeString(dateString, timeString) {
        if(!dateString || !timeString) {
            return null
        }

        const newDateString = Time._transformDateStringFromGermanToUSStyle(dateString)
        const newTimeString = Time._verifyTime(timeString)

        if(!newDateString || !newTimeString) {
            return null
        }

        return new Date(`${newDateString}T${newTimeString}:00`)
    }

    /**
     * @public
     * @param {Date} date
     * @return {String}
     */
    static dateToDateString(date) {
        return date.toDateString()
    }

    /**
     * @public
     * @param {Date} date
     * @return {String}
     */
    static dateToTimeString(date) {
        return date.toLocaleTimeString()
            .split(':')
            .slice(0, 2)
            .join(':')
    }
}

module.exports = Time
