import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class PrivacyRequests extends Model {
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
    request_type: {
      type: DataTypes.ENUM('EXPORT','DELETE'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('NEW','VERIFIED','PROCESSING','COMPLETED','REJECTED'),
      allowNull: false,
      defaultValue: "NEW"
    },
    verified_at: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    completed_at: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    result_note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    artifact_key: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'privacy_requests',
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
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
