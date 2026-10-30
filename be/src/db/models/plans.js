import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Plans extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "code"
    },
    audience: {
      type: DataTypes.ENUM('TOURIST','PARTNER'),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'plans',
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
