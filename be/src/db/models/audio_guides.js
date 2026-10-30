import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class AudioGuides extends Model {
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
      },
      unique: "audio_guides_ibfk_1"
    },
    place_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'places',
        key: 'id'
      }
    },
    premium_only: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'audio_guides',
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
        name: "content_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "content_id" },
        ]
      },
      {
        name: "place_id",
        using: "BTREE",
        fields: [
          { name: "place_id" },
        ]
      },
    ]
  });
  }
}
