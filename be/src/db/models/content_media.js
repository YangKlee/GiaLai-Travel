import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ContentMedia extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    revision_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'content_revisions',
        key: 'id'
      }
    },
    asset_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'media_assets',
        key: 'id'
      }
    },
    sort_order: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'content_media',
    timestamps: false,
    freezeTableName: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "revision_id" },
          { name: "asset_id" },
        ]
      },
      {
        name: "asset_id",
        using: "BTREE",
        fields: [
          { name: "asset_id" },
        ]
      },
    ]
  });
  }
}
