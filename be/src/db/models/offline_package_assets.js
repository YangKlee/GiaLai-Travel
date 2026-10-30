import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class OfflinePackageAssets extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    package_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'offline_packages',
        key: 'id'
      }
    },
    asset_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'media_assets',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'offline_package_assets',
    timestamps: false,
    freezeTableName: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "package_id" },
          { name: "asset_id" },
        ]
      },
      {
        name: "asset_id",
        using: "BTREE",
        fields: [
          { name: "asset_id" },
        ]
      },
    ]
  });
  }
}
