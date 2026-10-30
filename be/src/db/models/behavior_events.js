import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class BehaviorEvents extends Model {
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
    consent_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'consents',
        key: 'id'
      }
    },
    content_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'content_items',
        key: 'id'
      }
    },
    region_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'regions',
        key: 'id'
      }
    },
    event_kind: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'behavior_events',
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
        name: "consent_id",
        using: "BTREE",
        fields: [
          { name: "consent_id" },
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
        name: "region_id",
        using: "BTREE",
        fields: [
          { name: "region_id" },
        ]
      },
      {
        name: "ix_behavior_user_time",
        using: "BTREE",
        fields: [
          { name: "user_id" },
          { name: "created_at" },
        ]
      },
    ]
  });
  }
}
