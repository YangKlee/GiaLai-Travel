import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ConfigVersions extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    config_key: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    version_no: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    effective_from: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    payload: {
      type: DataTypes.JSON,
      allowNull: false
    },
    approved_by: {
      type: DataTypes.CHAR(36),
      allowNull: true,
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
    tableName: 'config_versions',
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
        name: "uq_config_version",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "config_key" },
          { name: "version_no" },
        ]
      },
      {
        name: "ix_config_effective",
        using: "BTREE",
        fields: [
          { name: "config_key" },
          { name: "effective_from" },
        ]
      },
      {
        name: "approved_by",
        using: "BTREE",
        fields: [
          { name: "approved_by" },
        ]
      },
    ]
  });
  }
}
