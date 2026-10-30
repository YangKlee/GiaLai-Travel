import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Bookings extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    customer_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    service_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'service_slots',
        key: 'service_id'
      }
    },
    slot_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'service_slots',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('CHO_DUYET','CHO_THANH_TOAN','DA_XAC_NHAN','TU_CHOI','HET_HAN','DA_HUY','HOAN_THANH'),
      allowNull: false,
      defaultValue: "CHO_DUYET"
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    unit_price_vnd: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    total_vnd: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    commission_percent: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      defaultValue: 10.00
    },
    policy_snapshot: {
      type: DataTypes.JSON,
      allowNull: false
    },
    service_snapshot: {
      type: DataTypes.JSON,
      allowNull: false
    },
    contact_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    contact_email: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    contact_phone: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    starts_at: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    ends_at: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    review_deadline: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    payment_deadline: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    reviewed_by: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    reviewed_at: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cancelled_at: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    completed_at: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    idempotency_key: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    lock_version: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    },
    updated_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'bookings',
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
        name: "uq_booking_request",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "customer_id" },
          { name: "idempotency_key" },
        ]
      },
      {
        name: "service_id",
        using: "BTREE",
        fields: [
          { name: "service_id" },
        ]
      },
      {
        name: "slot_id",
        using: "BTREE",
        fields: [
          { name: "slot_id" },
          { name: "service_id" },
        ]
      },
      {
        name: "reviewed_by",
        using: "BTREE",
        fields: [
          { name: "reviewed_by" },
        ]
      },
      {
        name: "ix_booking_expiry",
        using: "BTREE",
        fields: [
          { name: "status" },
          { name: "review_deadline" },
          { name: "payment_deadline" },
        ]
      },
      {
        name: "ix_booking_slot",
        using: "BTREE",
        fields: [
          { name: "slot_id" },
          { name: "status" },
        ]
      },
    ]
  });
  }
}
