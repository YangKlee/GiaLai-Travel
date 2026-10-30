import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class PartnerMembers extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    partner_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'partners',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    membership_role: {
      type: DataTypes.ENUM('OWNER','STAFF'),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'partner_members',
    timestamps: false,
    freezeTableName: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "partner_id" },
          { name: "user_id" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
