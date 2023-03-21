'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.hasMany(models.EventImage, {foreignKey: 'eventId'})
      Event.belongsTo(models.Venue, {foreignKey: 'venueId'})
      Event.belongsTo(models.Group, {foreignKey: 'groupId'})
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
      references: {model: 'Venues', key: 'id'}
    },
    groupId: {
      type: DataTypes.INTEGER,
      references: {model: 'Groups'}
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    type: DataTypes.ENUM('in person', 'online'),
    capacity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
