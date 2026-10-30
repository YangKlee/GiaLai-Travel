import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class PlaceClosures extends Model {
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
    starts_at: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    ends_at: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    source_reference: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    recorded_by: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'place_closures',
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
        name: "recorded_by",
        using: "BTREE",
        fields: [
          { name: "recorded_by" },
        ]
      },
      {
        name: "ix_closure_place_time",
        using: "BTREE",
        fields: [
          { name: "place_id" },
          { name: "starts_at" },
          { name: "ends_at" },
        ]
      },
    ]
  });
  }
}
