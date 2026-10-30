import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class PlanVersions extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    plan_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'plans',
        key: 'id'
      }
    },
    version_no: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    price_vnd: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    period_months: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false
    },
    features: {
      type: DataTypes.JSON,
      allowNull: false
    },
    effective_from: {
      type: DataTypes.DATE(6),
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
    tableName: 'plan_versions',
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
        name: "uq_plan_version",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "plan_id" },
          { name: "version_no" },
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
