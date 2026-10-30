import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Users extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    email_key: {
      type: DataTypes.STRING(254),
      allowNull: true,
      unique: "uq_users_email"
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    display_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('ACTIVE','LOCKED','ANONYMIZED'),
      allowNull: false,
      defaultValue: "ACTIVE"
    },
    preferences: {
      type: DataTypes.JSON,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    },
    updated_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'users',
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
        name: "uq_users_email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email_key" },
        ]
      },
    ]
  });
  }
}
