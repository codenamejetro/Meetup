'use strict';
const bcrypt = require("bcryptjs");

const { Membership } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Memberships';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        groupId: 1,
        status: 'organizer'
      },
      {
        userId: 2,
        groupId: 1,
        status: 'co-host'
      },
      {
        userId: 3,
        groupId: 1,
        status: 'member'
      },
      {
        userId: 4,
        groupId: 2,
        status: 'organizer'
      },
      {
        userId: 5,
        groupId: 2,
        status: 'co-host'
      },
      {
        userId: 6,
        groupId: 2,
        status: 'member'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      status: { [Op.in]: ['organizer', 'co-host', 'member', 'pending'] }
    }, {});
  }
};
