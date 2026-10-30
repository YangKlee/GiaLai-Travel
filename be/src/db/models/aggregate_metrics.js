import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class AggregateMetrics extends Model {
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
    metric_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    metric_code: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    metric_value: {
      type: DataTypes.DECIMAL(20,4),
      allowNull: false
    },
    distinct_account_count: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    complement_safe: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    config_version_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'config_versions',
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
    tableName: 'aggregate_metrics',
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
        name: "uq_metric_bucket",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "region_id" },
          { name: "metric_date" },
          { name: "metric_code" },
          { name: "config_version_id" },
        ]
      },
      {
        name: "config_version_id",
        using: "BTREE",
        fields: [
          { name: "config_version_id" },
        ]
      },
    ]
  });
  }
}
