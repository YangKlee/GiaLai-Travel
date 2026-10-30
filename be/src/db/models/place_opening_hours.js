import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class PlaceOpeningHours extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    place_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'places',
        key: 'id'
      }
    },
    weekday: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false
    },
    opens_at: {
      type: DataTypes.TIME,
      allowNull: false
    },
    closes_at: {
      type: DataTypes.TIME,
      allowNull: false
    },
    crosses_midnight: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'place_opening_hours',
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
        name: "uq_opening_interval",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "place_id" },
          { name: "weekday" },
          { name: "opens_at" },
        ]
      },
    ]
  });
  }
}
