import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class BookingStatusHistory extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    booking_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'bookings',
        key: 'id'
      }
    },
    from_status: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    to_status: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    actor_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'booking_status_history',
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
        name: "booking_id",
        using: "BTREE",
        fields: [
          { name: "booking_id" },
        ]
      },
      {
        name: "actor_id",
        using: "BTREE",
        fields: [
          { name: "actor_id" },
        ]
      },
    ]
  });
  }
}
