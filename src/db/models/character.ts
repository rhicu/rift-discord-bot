import { Model, DataTypes } from 'sequelize';
import { db } from '@src/db/database';

class Character extends Model {
  public id!: number;

  public discordID!: number;

  public characterName!: string;

  public shortName!: string;

  public riftClass!: string;

  public roles!: string[];

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}

Character.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    discordID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'compositeKey',
    },
    characterName: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    shortName: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: 'compositeKey',
    },
    riftClass: {
      type: new DataTypes.ENUM(),
      values: ['WARRIOR', 'CLERIC', 'MAGE', 'ROGUE', 'PRIMALIST'],
      allowNull: true,
    },
    roles: {
      type: new DataTypes.ARRAY(DataTypes.ENUM()),
      values: ['HEAL', 'TANK', 'SUPPORT', 'DAMAGE_DEALER'],
    },
  },
  {
    tableName: 'character',
    sequelize: db,
  },
);

export { Character };
