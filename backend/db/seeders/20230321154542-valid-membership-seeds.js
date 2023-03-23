'use strict';

const { Membership } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const validMembership = [
  {
    userId: 1,
    groupId: 1,
    status: 'organizer'
  },
  {
    userId: 2,
    groupId: 2,
    status: 'co-host'
  },
  {
    userId: 3,
    groupId: 3,
    status: 'member'
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await Membership.bulkCreate(validMembership, options, {
        validate: true,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    for (let membershipInfo of validMembership) {
      try {
        await Membership.destroy(options, {
          where: membershipInfo
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
};
