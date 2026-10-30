import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class RewardGrants extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    program_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'reward_programs',
        key: 'id'
      }
    },
    beneficiary_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    referral_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'referrals',
        key: 'id'
      }
    },
    issue_report_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'issue_reports',
        key: 'id'
      }
    },
    source_key: {
      type: DataTypes.STRING(190),
      allowNull: false
    },
    benefit_snapshot: {
      type: DataTypes.JSON,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'reward_grants',
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
        name: "uq_reward_source",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "program_id" },
          { name: "source_key" },
        ]
      },
      {
        name: "beneficiary_id",
        using: "BTREE",
        fields: [
          { name: "beneficiary_id" },
        ]
      },
      {
        name: "referral_id",
        using: "BTREE",
        fields: [
          { name: "referral_id" },
        ]
      },
      {
        name: "issue_report_id",
        using: "BTREE",
        fields: [
          { name: "issue_report_id" },
        ]
      },
    ]
  });
  }
}
