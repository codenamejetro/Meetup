'use strict'
const { Group } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const validGroup = [
  {
    organizerId: 1,
    name: 'group1',
    about: 'fun in the Bay Area',
    type: 'In person',
    private: true,
    city: 'San Francisco',
    state: 'California'
  },
  {
    organizerId: 2,
    name: 'group2',
    about: 'going crazy in Florida',
    type: 'Online',
    private: false,
    city: 'Tallahassee',
    state: 'Florida'
  },
  {
    organizerId: 3,
    name: 'group3',
    about: 'Michigan peeps',
    type: 'Online',
    private: false,
    city: 'Lansing',
    state: 'Michigan'
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await Group.bulkCreate(validGroup, options, {
        validate: true,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    for (let groupInfo of validGroup) {
      try {
        await Group.destroy(options, {
          where: groupInfo
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
};
