import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ItineraryStops extends Model {
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
        model: 'itinerary_days',
        key: 'id'
      }
    },
    place_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'places',
        key: 'id'
      }
    },
    content_revision_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'content_revisions',
        key: 'id'
      }
    },
    event_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'events',
        key: 'id'
      }
    },
    sequence_no: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false
    },
    arrives_at: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    departs_at: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    estimated_cost_vnd: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    cost_breakdown: {
      type: DataTypes.JSON,
      allowNull: true
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'itinerary_stops',
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
        name: "uq_stop_sequence",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "day_id" },
          { name: "sequence_no" },
        ]
      },
      {
        name: "uq_stop_day",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "day_id" },
          { name: "id" },
        ]
      },
      {
        name: "place_id",
        using: "BTREE",
        fields: [
          { name: "place_id" },
        ]
      },
      {
        name: "content_revision_id",
        using: "BTREE",
        fields: [
          { name: "content_revision_id" },
        ]
      },
      {
        name: "event_id",
        using: "BTREE",
        fields: [
          { name: "event_id" },
        ]
      },
    ]
  });
  }
}
