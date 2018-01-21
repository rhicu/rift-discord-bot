module.exports = (sequelize, DataTypes) => {
    return sequelize.define('raid', {
        type: {
            type: DataTypes.STRING,
            validate: {
                isLowercase: true,
                notNull: true,
                notEmpty: true
            }
        },
        start: {
            type: DataTypes.DATE,
            validate: {
                notNull: true,
                notEmpty: true
            }
        },
        end: {
            type: DataTypes.DATE,
            validate: {
                notNull: true,
                notEmpty: true
            }
        },
        raidLead: {
            type: DataTypes.STRING,
            validate: {
                isLowercase: true,
                notNull: true,
                notEmpty: true
            }
        },
        messageID: {
            type: DataTypes.STRING,
            validate: {
                notNull: true,
                notEmpty: true
            }
        },
        member: {
            type: DataTypes.JSON,
            validate: {
                notNull: true,
                notEmpty: true,
                isInitialized(value) {
                    if(!value.registered || !value.confirmed || !value.deregistered) {
                        throw new Error('List of Members has not been initialized!')
                    }
                }
            }
        },
        recurring: {
            type: DataTypes.BOOLEAN,
            validate: {
                notNull: true,
                notEmpty: true
            }
        },
        mainRaid: {
            type: DataTypes.BOOLEAN,
            validate: {
                notNull: true,
                notEmpty: true
            }
        }
    })
}
