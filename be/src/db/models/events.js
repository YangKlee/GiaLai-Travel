import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Events extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    content_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'content_items',
        key: 'id'
      },
      unique: "events_ibfk_1"
    },
    place_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'places',
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
    event_status: {
      type: DataTypes.ENUM('SCHEDULED','CANCELLED','COMPLETED'),
      allowNull: false,
      defaultValue: "SCHEDULED"
    },
    external_source_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'external_sources',
        key: 'id'
      }
    },
    external_key: {
      type: DataTypes.STRING(190),
      allowNull: true
    },
    synced_at: {
      type: DataTypes.DATE(6),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'events',
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
        name: "content_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "content_id" },
        ]
      },
      {
        name: "uq_event_external",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "external_source_id" },
          { name: "external_key" },
        ]
      },
      {
        name: "place_id",
        using: "BTREE",
        fields: [
          { name: "place_id" },
        ]
      },
    ]
  });
  }
}
