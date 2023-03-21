'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Venue.hasMany(models.Event, {foreignKey: 'venueId'})
      Venue.belongsTo(models.Group, {foreignKey: 'groupId'})
    }
  }
  Venue.init({
    groupId: {
      type: DataTypes.INTEGER,
      references: {model: 'Groups', key: 'id'}
    },
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};
