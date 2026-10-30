import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Regions extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    parent_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'regions',
        key: 'id'
      }
    },
    code: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: "code"
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    phase: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'regions',
    timestamps: false,
    freezeTableName: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "code",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "code" },
        ]
      },
      {
        name: "parent_id",
        using: "BTREE",
        fields: [
          { name: "parent_id" },
        ]
      },
    ]
  });
  }
}
