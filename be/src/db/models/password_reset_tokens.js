import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class PasswordResetTokens extends Model {
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
    token_hash: {
      type: DataTypes.BLOB,
      allowNull: false,
      unique: "token_hash"
    },
    expires_at: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    used_at: {
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
    tableName: 'password_reset_tokens',
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
        name: "token_hash",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "token_hash" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
