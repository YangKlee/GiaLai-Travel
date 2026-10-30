import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class OfflinePackages extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    region_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'regions',
        key: 'id'
      }
    },
    language_code: {
      type: DataTypes.ENUM('vi','en','ko','zh','jra'),
      allowNull: false
    },
    version_no: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    tier: {
      type: DataTypes.ENUM('BASIC','PREMIUM'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('DRAFT','READY','RETIRED'),
      allowNull: false,
      defaultValue: "DRAFT"
    },
    manifest: {
      type: DataTypes.JSON,
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
    license_reference: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'offline_packages',
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
        name: "uq_offline_package",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "region_id" },
          { name: "language_code" },
          { name: "tier" },
          { name: "version_no" },
        ]
      },
    ]
  });
  }
}
