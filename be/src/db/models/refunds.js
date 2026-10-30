import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Refunds extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    payment_attempt_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'payment_attempts',
        key: 'id'
      },
      unique: "refunds_ibfk_1"
    },
    booking_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'bookings',
        key: 'id'
      },
      unique: "refunds_ibfk_1"
    },
    amount_vnd: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('HOAN_GIA_LAP_THANH_CONG'),
      allowNull: false,
      defaultValue: "HOAN_GIA_LAP_THANH_CONG"
    },
    is_mock: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    idempotency_key: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: "idempotency_key"
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'refunds',
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
        name: "payment_attempt_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "payment_attempt_id" },
        ]
      },
      {
        name: "idempotency_key",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idempotency_key" },
        ]
      },
      {
        name: "payment_attempt_id_2",
        using: "BTREE",
        fields: [
          { name: "payment_attempt_id" },
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
    ]
  });
  }
}
