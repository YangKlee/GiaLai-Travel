import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ConditionObservations extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    place_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'places',
        key: 'id'
      }
    },
    source_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'external_sources',
        key: 'id'
      }
    },
    config_version_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: {
        model: 'config_versions',
        key: 'id'
      }
    },
    kind: {
      type: DataTypes.ENUM('WEATHER','CROWD','CLOSURE'),
      allowNull: false
    },
    observed_at: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    valid_until: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    quality: {
      type: DataTypes.ENUM('SUFFICIENT','INSUFFICIENT','STALE'),
      allowNull: false
    },
    value_payload: {
      type: DataTypes.JSON,
      allowNull: true
    },
    source_reference: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'condition_observations',
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
        name: "source_id",
        using: "BTREE",
        fields: [
          { name: "source_id" },
        ]
      },
      {
        name: "config_version_id",
        using: "BTREE",
        fields: [
          { name: "config_version_id" },
        ]
      },
      {
        name: "ix_condition_place",
        using: "BTREE",
        fields: [
          { name: "place_id" },
          { name: "kind" },
          { name: "observed_at" },
        ]
      },
    ]
  });
  }
}
