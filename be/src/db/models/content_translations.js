import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ContentTranslations extends Model {
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
    language_code: {
      type: DataTypes.ENUM('vi','en','ko','zh','jra'),
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    transcript: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    audio_asset_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'media_assets',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'content_translations',
    timestamps: false,
    freezeTableName: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "revision_id" },
          { name: "language_code" },
        ]
      },
      {
        name: "audio_asset_id",
        using: "BTREE",
        fields: [
          { name: "audio_asset_id" },
        ]
      },
    ]
  });
  }
}
