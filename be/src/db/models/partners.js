import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Partners extends Model {
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
      unique: "partners_ibfk_1"
    },
    status: {
      type: DataTypes.ENUM('PENDING','ACTIVE','SUSPENDED'),
      allowNull: false,
      defaultValue: "PENDING"
    },
    contact_email: {
      type: DataTypes.STRING(254),
      allowNull: true
    },
    contact_phone: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(6)"
    }
  }, {
    sequelize,
    tableName: 'partners',
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
    ]
  });
  }
}
