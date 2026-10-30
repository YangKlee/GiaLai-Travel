import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Consents extends Model {
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
    purpose: {
      type: DataTypes.ENUM('PERSONALIZATION','ADVERTISING'),
      allowNull: false
    },
    decision_no: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    granted: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    policy_version: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'consents',
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
        name: "uq_consent_decision",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
          { name: "purpose" },
          { name: "decision_no" },
        ]
      },
    ]
  });
  }
}
