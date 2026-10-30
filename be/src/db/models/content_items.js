import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ContentItems extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'content_revisions',
        key: 'content_id'
      }
    },
    kind: {
      type: DataTypes.ENUM('PLACE','ARTICLE','AUDIO','EVENT','PARTNER','SERVICE','JRAI_PHRASE'),
      allowNull: false
    },
    visibility: {
      type: DataTypes.ENUM('DRAFT','PUBLIC','HIDDEN'),
      allowNull: false,
      defaultValue: "DRAFT"
    },
    published_revision_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'content_revisions',
        key: 'id'
      }
    },
    created_by: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
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
    tableName: 'content_items',
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
        name: "created_by",
        using: "BTREE",
        fields: [
          { name: "created_by" },
        ]
      },
      {
        name: "fk_content_public_revision",
        using: "BTREE",
        fields: [
          { name: "id" },
          { name: "published_revision_id" },
        ]
      },
    ]
  });
  }
}
