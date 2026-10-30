import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Entitlements extends Model {
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
    partner_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'partners',
        key: 'id'
      }
    },
    plan_version_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'plan_versions',
        key: 'id'
      }
    },
    purchase_order_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'purchase_orders',
        key: 'id'
      },
      unique: "entitlements_ibfk_4"
    },
    reward_grant_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'reward_grants',
        key: 'id'
      },
      unique: "entitlements_ibfk_5"
    },
    starts_at: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    ends_at: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    revoked_at: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    auto_renew: {
      type: DataTypes.BOOLEAN,
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
    tableName: 'entitlements',
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
        name: "purchase_order_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "purchase_order_id" },
        ]
      },
      {
        name: "reward_grant_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "reward_grant_id" },
        ]
      },
      {
        name: "plan_version_id",
        using: "BTREE",
        fields: [
          { name: "plan_version_id" },
        ]
      },
      {
        name: "ix_entitlement_user",
        using: "BTREE",
        fields: [
          { name: "user_id" },
          { name: "starts_at" },
          { name: "ends_at" },
        ]
      },
      {
        name: "ix_entitlement_partner",
        using: "BTREE",
        fields: [
          { name: "partner_id" },
          { name: "starts_at" },
          { name: "ends_at" },
        ]
      },
    ]
  });
  }
}
