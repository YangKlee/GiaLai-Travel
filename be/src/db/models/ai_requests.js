import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class AiRequests extends Model {
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
    itinerary_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'itineraries',
        key: 'id'
      }
    },
    purpose: {
      type: DataTypes.ENUM('GENERATE','CHAT','ADAPT'),
      allowNull: false
    },
    provider: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    model_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    prompt_version: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('RUNNING','SUCCEEDED','FAILED','TIMEOUT'),
      allowNull: false,
      defaultValue: "RUNNING"
    },
    input_context: {
      type: DataTypes.JSON,
      allowNull: false
    },
    output_payload: {
      type: DataTypes.JSON,
      allowNull: true
    },
    error_code: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    latency_ms: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    cost_vnd: {
      type: DataTypes.DECIMAL(16,4),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    },
    completed_at: {
      type: DataTypes.DATE(6),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ai_requests',
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
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "itinerary_id",
        using: "BTREE",
        fields: [
          { name: "itinerary_id" },
        ]
      },
    ]
  });
  }
}
