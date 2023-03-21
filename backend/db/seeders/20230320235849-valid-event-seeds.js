'use strict';

const { Event } = require('../models')

const validEvent = [
  {
    venueId: 1,
    groupId: 1,
    name: 'Sousou',
    description: 'Magic and fun',
    type: 'in person',
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
    type: 'online',
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
    type: 'in person',
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
      await Event.bulkCreate(validEvent, {
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
        await Attendance.destroy({
          where: eventInfo
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
};
