'use strict';
const bcrypt = require("bcryptjs");

const { Group } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    return queryInterface.bulkInsert(options, [
      {
        organizerId: 1,
        name: 'group1',
        about: 'fun in the Bay Area',
        type: 'online',
        private: true,
        city: 'San Francisco',
        state: 'California'
      },
      {
        organizerId: 2,
        name: 'group2',
        about: 'going crazy in Florida',
        type: 'online',
        private: false,
        city: 'Tallahassee',
        state: 'Florida'
      },
      {
        organizerId: 3,
        name: 'group3',
        about: 'Michigan peeps',
        type: 'online',
        private: false,
        city: 'Lansing',
        state: 'Michigan'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      type: { [Op.in]: ['Online', 'In person'] }
    }, {});
  }
};
