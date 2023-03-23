'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.hasMany(models.Event, {foreignKey: 'groupId'})
      Group.hasMany(models.Venue, {foreignKey: 'groupId'})
      Group.hasMany(models.GroupImage, {foreignKey: 'groupId'})
      Group.hasMany(models.Membership, {foreignKey: 'groupId'})
      Group.belongsTo(models.User, {foreignKey: 'organizerId'})
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      references: {model: 'Users', key: 'id'}
    },
    name: DataTypes.STRING,
    about: DataTypes.STRING,
    type: DataTypes.ENUM('In person', 'Online'),
    private: DataTypes.BOOLEAN,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
