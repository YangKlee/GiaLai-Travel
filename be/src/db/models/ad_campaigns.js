import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class AdCampaigns extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    partner_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'partners',
        key: 'id'
      }
    },
    content_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'content_items',
        key: 'id'
      }
    },
    placement: {
      type: DataTypes.STRING(80),
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
    budget_vnd: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    spent_vnd: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('DRAFT','ACTIVE','PAUSED','ENDED'),
      allowNull: false,
      defaultValue: "DRAFT"
    },
    config_snapshot: {
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
    tableName: 'ad_campaigns',
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
        name: "partner_id",
        using: "BTREE",
        fields: [
          { name: "partner_id" },
        ]
      },
      {
        name: "content_id",
        using: "BTREE",
        fields: [
          { name: "content_id" },
        ]
      },
    ]
  });
  }
}
