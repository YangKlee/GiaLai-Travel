import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ChatMessages extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    conversation_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'chat_conversations',
        key: 'id'
      }
    },
    speaker: {
      type: DataTypes.ENUM('USER','ASSISTANT'),
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ai_request_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'ai_requests',
        key: 'id'
      }
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'chat_messages',
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
        name: "conversation_id",
        using: "BTREE",
        fields: [
          { name: "conversation_id" },
        ]
      },
      {
        name: "ai_request_id",
        using: "BTREE",
        fields: [
          { name: "ai_request_id" },
        ]
      },
    ]
  });
  }
}
