import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class AdImpressions extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    campaign_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'ad_campaigns',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    consent_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'consents',
        key: 'id'
      }
    },
    personalized: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    charge_vnd: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'ad_impressions',
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
        name: "campaign_id",
        using: "BTREE",
        fields: [
          { name: "campaign_id" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "consent_id",
        using: "BTREE",
        fields: [
          { name: "consent_id" },
        ]
      },
    ]
  });
  }
}
