'use strict'
const { Group } = require('../models')

const validGroup = [
  {
    organizerId: 1,
    name: 'group1',
    about: 'fun in the Bay Area',
    type: 'in person',
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
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await Group.bulkCreate(validGroup, {
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
        await Group.destroy({
          where: groupInfo
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
};
