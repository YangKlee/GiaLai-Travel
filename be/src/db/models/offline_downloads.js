import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class OfflineDownloads extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    device_key: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    package_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'offline_packages',
        key: 'id'
      }
    },
    itinerary_revision_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'itinerary_revisions',
        key: 'id'
      }
    },
    entitlement_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'entitlements',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('DOWNLOADING','READY','FAILED','REMOVED'),
      allowNull: false,
      defaultValue: "DOWNLOADING"
    },
    completed_at: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    local_manifest_version: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'offline_downloads',
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
        name: "package_id",
        using: "BTREE",
        fields: [
          { name: "package_id" },
        ]
      },
      {
        name: "itinerary_revision_id",
        using: "BTREE",
        fields: [
          { name: "itinerary_revision_id" },
        ]
      },
      {
        name: "entitlement_id",
        using: "BTREE",
        fields: [
          { name: "entitlement_id" },
        ]
      },
      {
        name: "ix_download_device",
        using: "BTREE",
        fields: [
          { name: "user_id" },
          { name: "device_key" },
        ]
      },
    ]
  });
  }
}
