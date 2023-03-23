'use strict';
const bcrypt = require("bcryptjs");

const { Venue } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Venues';
    return queryInterface.bulkInsert(options, [
      {
        groupId: '1',
        address: '123 Main st.',
        city: 'City1',
        state: 'State1',
        lat: 12.3,
        lng: 12.3
      },
      {
        groupId: '2',
        address: '456 Kayn st.',
        city: 'City2',
        state: 'State2',
        lat: 45.6,
        lng: 45.6
      },
      {
        groupId: '3',
        address: '789 Brain st.',
        city: 'City3',
        state: 'State3',
        lat: 78.9,
        lng: 78.9
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      city: { [Op.in]: ['City1', 'City2', 'City3'] }
    }, {});
  }
};
