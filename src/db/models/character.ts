import { Model, DataTypes } from 'sequelize';
import { db } from '@src/db/database';
import logger from '@lib/logger';

class Character extends Model {
  public id!: number;

  public discordID!: number;

  public characterName!: string;

  public shortName!: string;

  public riftClass!: string;

  public riftRoles!: string[];

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}

enum RiftClass {
  WARRIOR = 'WARRIOR',
  CLERIC = 'CLERIC',
  MAGE = 'MAGE',
  ROGUE = 'ROGUE',
  PRIMALIST = 'PRIMALIST',
}

enum RiftRoles {
  HEAL = 'HEAL',
  TANK = 'TANK',
  SUPPORT = 'SUPPORT',
  DAMAGE_DEALER = 'DAMAGE_DEALER',
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
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    shortName: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: 'compositeKey',
    },
    riftClass: {
      type: DataTypes.ENUM({
        values: Object.keys(RiftClass),
      }),
      allowNull: true,
    },
    riftRoles: {
      type: DataTypes.ARRAY(DataTypes.ENUM({
        values: Object.keys(RiftRoles),
      })),
    },
  },
  {
    tableName: 'character',
    sequelize: db,
  },
);

export {
  Character,
  RiftClass,
  RiftRoles,
};
