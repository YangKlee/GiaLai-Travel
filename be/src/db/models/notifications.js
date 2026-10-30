import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Notifications extends Model {
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
    event_key: {
      type: DataTypes.STRING(190),
      allowNull: false
    },
    kind: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    target_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    target_id: {
      type: DataTypes.CHAR(36),
      allowNull: true
    },
    read_at: {
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
    tableName: 'notifications',
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
        name: "uq_notification_event",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
          { name: "event_key" },
        ]
      },
      {
        name: "ix_notification_inbox",
        using: "BTREE",
        fields: [
          { name: "user_id" },
          { name: "read_at" },
          { name: "created_at" },
        ]
      },
    ]
  });
  }
}
