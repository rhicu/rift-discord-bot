module.exports = (sequelize, DataTypes) => {
    return sequelize.define('raid', {
        id: DataTypes.INTEGER,
        type: DataTypes.STRING,
        start: DataTypes.DATE,
        end: DataTypes.DATE,
        raidLead: DataTypes.STRING,
        messageID: DataTypes.STRING
    })
}
