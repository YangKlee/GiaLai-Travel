import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ContentRevisions extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    content_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'content_items',
        key: 'id'
      }
    },
    revision_no: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('DRAFT','PENDING','PUBLISHED','REJECTED'),
      allowNull: false,
      defaultValue: "DRAFT"
    },
    source_reference: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    payload: {
      type: DataTypes.JSON,
      allowNull: false
    },
    submitted_by: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    reviewed_by: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    reviewed_at: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'content_revisions',
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
        name: "uq_revision_number",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "content_id" },
          { name: "revision_no" },
        ]
      },
      {
        name: "uq_revision_owner",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "content_id" },
          { name: "id" },
        ]
      },
      {
        name: "submitted_by",
        using: "BTREE",
        fields: [
          { name: "submitted_by" },
        ]
      },
      {
        name: "reviewed_by",
        using: "BTREE",
        fields: [
          { name: "reviewed_by" },
        ]
      },
    ]
  });
  }
}
