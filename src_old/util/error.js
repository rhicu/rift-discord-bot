
/** */
class InvalidInputError extends Error {

    /** */
    constructor(...args) {
        super(...args)
        Error.captureStackTrace(this, InvalidInputError)
    }
}

module.exports = InvalidInputError
