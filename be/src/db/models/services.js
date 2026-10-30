import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Services extends Model {
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
      unique: "services_ibfk_1"
    },
    partner_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'partners',
        key: 'id'
      }
    },
    place_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'places',
        key: 'id'
      }
    },
    service_type: {
      type: DataTypes.ENUM('HOMESTAY','EXPERIENCE','GUIDE','RENTAL','OTHER'),
      allowNull: false
    },
    price_unit: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    unit_price_vnd: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
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
    tableName: 'services',
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
        name: "place_id",
        using: "BTREE",
        fields: [
          { name: "place_id" },
        ]
      },
      {
        name: "ix_services_partner",
        using: "BTREE",
        fields: [
          { name: "partner_id" },
          { name: "active" },
        ]
      },
    ]
  });
  }
}
