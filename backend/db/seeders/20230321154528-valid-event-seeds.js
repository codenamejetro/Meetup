'use strict';
const { Event } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const validEvent = [
  {
    venueId: 1,
    groupId: 1,
    name: 'Sousou',
    description: 'Magic and fun',
    type: 'In person',
    capacity: '10',
    price: 87,
    startDate: '2023-1-11',
    endDate: '2023-2-11',
  },
  {
    venueId: 2,
    groupId: 2,
    name: 'No',
    description: 'Counting numbers',
    type: 'Online',
    capacity: '10',
    price: 87,
    startDate: '2023-3-11',
    endDate: '2023-4-11',
  },
  {
    venueId: 3,
    groupId: 3,
    name: 'Frieren',
    description: 'Primordial eternity',
    type: 'Online',
    capacity: '10',
    price: 87,
    startDate: '2023-5-11',
    endDate: '2023-6-11',
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await Event.bulkCreate(validEvent, options, {
        validate: true,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    for (let eventInfo of validEvent) {
      try {
        await Event.destroy(options, {
          where: eventInfo
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
};
