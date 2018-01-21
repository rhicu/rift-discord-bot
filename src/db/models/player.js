module.exports = (sequelize, DataTypes) => {
    return sequelize.define('player', {
        discordID: {
            type: DataTypes.STRING,
            validate: {
                notNull: true,
                notEmpty: true
            }
        },
        ingameName: {
            type: DataTypes.STRING,
            primaryKey: true,
            validate: {
                isLowercase: true,
                notNull: true,
                notEmpty: true
            }
        },
        riftClass: {
            type: DataTypes.STRING,
            validate: {
                isLowercase: true,
                notNull: true,
                notEmpty: true
            }
        },
        roles: {
            type: DataTypes.JSON,
            validate: {
                minOneRoleSetToTrue(value) {
                    if(!(value.dd || value.tank || value.heal || value.support)) {
                        throw new Error('Minimum 1 Role has to be choosen!')
                    }
                }
            }
        },
        shortName: {
            type: DataTypes.STRING,
            validate: {
                isLowercase: true,
                notNull: true,
                notEmpty: true
            }
        }
    })
}
