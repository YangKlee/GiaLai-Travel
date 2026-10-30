import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Roles extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'roles',
    timestamps: false,
    freezeTableName: true,
    indexes: [
      {
        name: "PRIMARY",
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
