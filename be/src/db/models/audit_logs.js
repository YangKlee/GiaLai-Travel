import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class AuditLogs extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    actor_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    action: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    target_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    target_id: {
      type: DataTypes.CHAR(36),
      allowNull: true
    },
    result: {
      type: DataTypes.ENUM('SUCCESS','FAILURE'),
      allowNull: false
    },
    correlation_id: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    redacted_metadata: {
      type: DataTypes.JSON,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'audit_logs',
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
        name: "actor_id",
        using: "BTREE",
        fields: [
          { name: "actor_id" },
        ]
      },
      {
        name: "ix_audit_target",
        using: "BTREE",
        fields: [
          { name: "target_type" },
          { name: "target_id" },
          { name: "created_at" },
        ]
      },
      {
        name: "ix_audit_correlation",
        using: "BTREE",
        fields: [
          { name: "correlation_id" },
        ]
      },
    ]
  });
  }
}
