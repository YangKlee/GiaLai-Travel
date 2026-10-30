import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Referrals extends Model {
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
    referrer_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    referred_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    qualified_at: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'referrals',
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
        name: "uq_referral_recipient",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "program_id" },
          { name: "referred_id" },
        ]
      },
      {
        name: "referrer_id",
        using: "BTREE",
        fields: [
          { name: "referrer_id" },
        ]
      },
      {
        name: "referred_id",
        using: "BTREE",
        fields: [
          { name: "referred_id" },
        ]
      },
    ]
  });
  }
}
