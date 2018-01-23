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
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        member: {
            type: DataTypes.JSON,
            allowNull: false,
            validate: {
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
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        mainRaid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    })
}
