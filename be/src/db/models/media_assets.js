import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class MediaAssets extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    storage_key: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: "storage_key"
    },
    media_type: {
      type: DataTypes.BLOB,
      allowNull: false
    },
    mime_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    byte_size: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    sha256: {
      type: DataTypes.BLOB,
      allowNull: false
    },
    source_reference: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    license_note: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    offline_allowed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    uploaded_by: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'media_assets',
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
        name: "storage_key",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "storage_key" },
        ]
      },
      {
        name: "uploaded_by",
        using: "BTREE",
        fields: [
          { name: "uploaded_by" },
        ]
      },
    ]
  });
  }
}
