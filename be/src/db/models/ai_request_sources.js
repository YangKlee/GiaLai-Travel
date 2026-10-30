import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class AiRequestSources extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    ai_request_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'ai_requests',
        key: 'id'
      }
    },
    content_revision_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'content_revisions',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'ai_request_sources',
    timestamps: false,
    freezeTableName: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ai_request_id" },
          { name: "content_revision_id" },
        ]
      },
      {
        name: "content_revision_id",
        using: "BTREE",
        fields: [
          { name: "content_revision_id" },
        ]
      },
    ]
  });
  }
}
