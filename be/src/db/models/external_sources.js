import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ExternalSources extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: "code"
    },
    source_type: {
      type: DataTypes.ENUM('EVENT','WEATHER','MAP','CROWD'),
      allowNull: false
    },
    endpoint_url: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    license_note: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    api_secret_ref: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'external_sources',
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
        name: "code",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "code" },
        ]
      },
    ]
  });
  }
}
