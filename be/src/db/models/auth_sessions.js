import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class AuthSessions extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    expires_at: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    revoked_at: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'auth_sessions',
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
        name: "ix_session_user",
        using: "BTREE",
        fields: [
          { name: "user_id" },
          { name: "expires_at" },
        ]
      },
    ]
  });
  }
}
