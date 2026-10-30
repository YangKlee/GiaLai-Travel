import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class UserRegionScopes extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    region_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'regions',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'user_region_scopes',
    timestamps: false,
    freezeTableName: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
          { name: "region_id" },
        ]
      },
      {
        name: "region_id",
        using: "BTREE",
        fields: [
          { name: "region_id" },
        ]
      },
    ]
  });
  }
}
