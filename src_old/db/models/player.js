module.exports = (sequelize, DataTypes) => {
    return sequelize.define('player', {
        discordID: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        ingameName: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isLowercase: true,
                notEmpty: true
            }
        },
        riftClass: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isLowercase: true,
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
            allowNull: false,
            validate: {
                isLowercase: true,
                notEmpty: true
            }
        }
    })
}
