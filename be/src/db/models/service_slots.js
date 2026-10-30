import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ServiceSlots extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    service_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'services',
        key: 'id'
      }
    },
    starts_at: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    ends_at: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    held_quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    sold_quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    updated_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'service_slots',
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
        name: "uq_slot_owner",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
          { name: "service_id" },
        ]
      },
      {
        name: "uq_slot_time",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "service_id" },
          { name: "starts_at" },
          { name: "ends_at" },
        ]
      },
    ]
  });
  }
}
