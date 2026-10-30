import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Itineraries extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'itinerary_revisions',
        key: 'itinerary_id'
      }
    },
    owner_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    current_revision_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'itinerary_revisions',
        key: 'id'
      }
    },
    lock_version: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    deleted_at: {
      type: DataTypes.DATE(6),
      allowNull: true
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
    tableName: 'itineraries',
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
        name: "ix_itinerary_owner",
        using: "BTREE",
        fields: [
          { name: "owner_id" },
          { name: "deleted_at" },
        ]
      },
      {
        name: "fk_itinerary_current_revision",
        using: "BTREE",
        fields: [
          { name: "id" },
          { name: "current_revision_id" },
        ]
      },
    ]
  });
  }
}
