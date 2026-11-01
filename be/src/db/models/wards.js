import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Wards extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          type: DataTypes.CHAR(36),
          allowNull: false,
          primaryKey: true,
        },
        region_id: {
          type: DataTypes.CHAR(36),
          allowNull: false,
          references: {
            model: 'regions',
            key: 'id',
          },
        },
        code: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: 'code',
        },
        name: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
          allowNull: false,
          defaultValue: 'ACTIVE',
        },
        created_at: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: Sequelize.fn('current_timestamp', 6),
        },
        updated_at: {
          type: DataTypes.DATE(6),
          allowNull: false,
          defaultValue: Sequelize.fn('current_timestamp', 6),
        },
      },
      {
        sequelize,
        tableName: 'wards',
        timestamps: false,
        freezeTableName: true,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'code',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'code' }],
          },
          {
            name: 'ix_wards_region',
            using: 'BTREE',
            fields: [{ name: 'region_id' }],
          },
        ],
      },
    );
  }
}

