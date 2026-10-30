import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ItineraryRevisions extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    itinerary_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'itineraries',
        key: 'id'
      }
    },
    revision_no: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    day_count: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false
    },
    traveler_count: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false
    },
    budget_vnd: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    estimated_total_vnd: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    departure_latitude: {
      type: DataTypes.DECIMAL(9,6),
      allowNull: false
    },
    departure_longitude: {
      type: DataTypes.DECIMAL(10,6),
      allowNull: false
    },
    transport_mode: {
      type: DataTypes.ENUM('MOTORBIKE','CAR','TAXI','BUS','WALK','MIXED'),
      allowNull: false
    },
    preferences: {
      type: DataTypes.JSON,
      allowNull: false
    },
    warnings: {
      type: DataTypes.JSON,
      allowNull: true
    },
    ai_request_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'ai_requests',
        key: 'id'
      }
    },
    created_by: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    validated_at: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'itinerary_revisions',
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
        name: "uq_itinerary_version",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "itinerary_id" },
          { name: "revision_no" },
        ]
      },
      {
        name: "uq_itinerary_revision_owner",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "itinerary_id" },
          { name: "id" },
        ]
      },
      {
        name: "ai_request_id",
        using: "BTREE",
        fields: [
          { name: "ai_request_id" },
        ]
      },
      {
        name: "created_by",
        using: "BTREE",
        fields: [
          { name: "created_by" },
        ]
      },
    ]
  });
  }
}
