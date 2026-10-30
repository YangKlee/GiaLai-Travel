import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class AuthRefreshTokens extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    session_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'auth_sessions',
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
    tableName: 'auth_refresh_tokens',
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
        name: "ix_refresh_session",
        using: "BTREE",
        fields: [
          { name: "session_id" },
          { name: "expires_at" },
        ]
      },
      {
        name: "ix_refresh_expiry",
        using: "BTREE",
        fields: [
          { name: "expires_at" },
        ]
      },
    ]
  });
  }
}
