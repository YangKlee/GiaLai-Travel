import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ItineraryDays extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    revision_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'itinerary_revisions',
        key: 'id'
      }
    },
    day_number: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false
    },
    travel_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'itinerary_days',
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
        name: "uq_itinerary_day",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "revision_id" },
          { name: "day_number" },
        ]
      },
      {
        name: "uq_itinerary_date",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "revision_id" },
          { name: "travel_date" },
        ]
      },
    ]
  });
  }
}
