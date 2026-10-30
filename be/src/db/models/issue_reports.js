import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class IssueReports extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    reporter_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    content_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'content_items',
        key: 'id'
      }
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('NEW','PROCESSING','ACCEPTED','REJECTED','CLOSED'),
      allowNull: false,
      defaultValue: "NEW"
    },
    assignee_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    duplicate_of: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'issue_reports',
        key: 'id'
      }
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    resolved_at: {
      type: DataTypes.DATE(6),
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
    tableName: 'issue_reports',
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
        name: "reporter_id",
        using: "BTREE",
        fields: [
          { name: "reporter_id" },
        ]
      },
      {
        name: "content_id",
        using: "BTREE",
        fields: [
          { name: "content_id" },
        ]
      },
      {
        name: "assignee_id",
        using: "BTREE",
        fields: [
          { name: "assignee_id" },
        ]
      },
      {
        name: "duplicate_of",
        using: "BTREE",
        fields: [
          { name: "duplicate_of" },
        ]
      },
    ]
  });
  }
}
