import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ItineraryLegs extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    day_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'itinerary_stops',
        key: 'day_id'
      }
    },
    from_stop_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'itinerary_stops',
        key: 'id'
      }
    },
    to_stop_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'itinerary_stops',
        key: 'id'
      }
    },
    distance_meters: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    duration_seconds: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    transport_mode: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    provider: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    source_reference: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    verified_at: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    estimated_cost_vnd: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'itinerary_legs',
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
        name: "uq_leg_destination",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "day_id" },
          { name: "to_stop_id" },
        ]
      },
      {
        name: "day_id",
        using: "BTREE",
        fields: [
          { name: "day_id" },
          { name: "from_stop_id" },
        ]
      },
    ]
  });
  }
}
