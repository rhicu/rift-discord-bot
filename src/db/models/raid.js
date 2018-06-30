module.exports = (sequelize, DataTypes) => {
    return sequelize.define('raid', {
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isLowercase: true,
                notEmpty: true
            }
        },
        start: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        end: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        raidLead: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isLowercase: true,
                notEmpty: true
            }
        },
        messageID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        member: {
            type: DataTypes.JSON,
            allowNull: false,
            validate: {
                notEmpty: true,
                isInitialized(value) {
                    if(!value.registered || !value.confirmed || !value.deregistered) {
                        throw new Error('List of members has not been initialized!')
                    }
                }
            }
        },
        recurring: {
            type: DataTypes.JSON,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        recurringMember: {
            type: DataTypes.JSON,
            allowNull: false,
            validate: {
                notEmpty: true,
                isInitialized(value) {
                    if(!value.player) {
                        throw new Error('List of recurring members has not been initialized!')
                    }
                }
            }
        },
        isMainRaid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        shouldBeDisplayed: {
            type: DataTypes.BOOLEAN
        }
    })
}
