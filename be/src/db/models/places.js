import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Places extends Model {
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
      unique: "places_ibfk_1"
    },
    region_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'regions',
        key: 'id'
      }
    },
    ward_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'wards',
        key: 'id'
      }
    },
    category: {
      type: DataTypes.ENUM('NATURE','CULTURE','FOOD','STAY','ADVENTURE','OTHER'),
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(9,6),
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(10,6),
      allowNull: false
    },
    reference_price_vnd: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    typical_duration_minutes: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: true
    },
    best_time_to_visit: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'places',
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
        name: "ix_place_region_category",
        using: "BTREE",
        fields: [
          { name: "region_id" },
          { name: "category" },
        ]
      },
    ]
  });
  }
}
