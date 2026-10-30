import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Commissions extends Model {
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
      },
      unique: "commissions_ibfk_1"
    },
    base_amount_vnd: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    rate_percent: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false
    },
    amount_vnd: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    is_mock: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'commissions',
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
        unique: true,
        using: "BTREE",
        fields: [
          { name: "booking_id" },
        ]
      },
    ]
  });
  }
}
