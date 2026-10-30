import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class UserRoles extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    role_code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'roles',
        key: 'code'
      }
    }
  }, {
    sequelize,
    tableName: 'user_roles',
    timestamps: false,
    freezeTableName: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
          { name: "role_code" },
        ]
      },
      {
        name: "role_code",
        using: "BTREE",
        fields: [
          { name: "role_code" },
        ]
      },
    ]
  });
  }
}
