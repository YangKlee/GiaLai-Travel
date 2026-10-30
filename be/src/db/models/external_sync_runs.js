import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ExternalSyncRuns extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    source_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'external_sources',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('RUNNING','SUCCEEDED','FAILED'),
      allowNull: false
    },
    started_at: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    finished_at: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    imported_count: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    updated_count: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    error_code: {
      type: DataTypes.STRING(80),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'external_sync_runs',
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
        name: "source_id",
        using: "BTREE",
        fields: [
          { name: "source_id" },
        ]
      },
    ]
  });
  }
}
