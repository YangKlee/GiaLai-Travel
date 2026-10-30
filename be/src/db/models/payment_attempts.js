import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class PaymentAttempts extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    booking_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'bookings',
        key: 'id'
      }
    },
    purchase_order_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'purchase_orders',
        key: 'id'
      }
    },
    amount_vnd: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('CHO_KET_QUA','THANH_CONG','THAT_BAI','DA_HUY_LAN_THU'),
      allowNull: false
    },
    is_mock: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    idempotency_key: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: "uq_payment_request"
    },
    successful_booking_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      unique: "uq_successful_booking"
    },
    successful_purchase_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      unique: "uq_successful_purchase"
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    },
    completed_at: {
      type: DataTypes.DATE(6),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'payment_attempts',
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
        name: "uq_payment_request",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idempotency_key" },
        ]
      },
      {
        name: "uq_successful_booking",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "successful_booking_id" },
        ]
      },
      {
        name: "uq_successful_purchase",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "successful_purchase_id" },
        ]
      },
      {
        name: "uq_payment_booking",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
          { name: "booking_id" },
        ]
      },
      {
        name: "booking_id",
        using: "BTREE",
        fields: [
          { name: "booking_id" },
        ]
      },
      {
        name: "purchase_order_id",
        using: "BTREE",
        fields: [
          { name: "purchase_order_id" },
        ]
      },
    ]
  });
  }
}
