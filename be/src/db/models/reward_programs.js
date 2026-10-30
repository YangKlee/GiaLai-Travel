import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class RewardPrograms extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    version_no: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    program_type: {
      type: DataTypes.ENUM('REFERRAL','ISSUE_REPORT'),
      allowNull: false
    },
    conditions: {
      type: DataTypes.JSON,
      allowNull: false
    },
    benefits: {
      type: DataTypes.JSON,
      allowNull: false
    },
    starts_at: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    ends_at: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'reward_programs',
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
        name: "uq_reward_program",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "code" },
          { name: "version_no" },
        ]
      },
    ]
  });
  }
}
