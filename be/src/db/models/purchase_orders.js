import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class PurchaseOrders extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    buyer_id: {
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
    amount_vnd: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING','SUCCEEDED','CANCELLED','EXPIRED'),
      allowNull: false,
      defaultValue: "PENDING"
    },
    expires_at: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    idempotency_key: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'purchase_orders',
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
        name: "uq_purchase_request",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "buyer_id" },
          { name: "idempotency_key" },
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
        name: "plan_version_id",
        using: "BTREE",
        fields: [
          { name: "plan_version_id" },
        ]
      },
    ]
  });
  }
}
