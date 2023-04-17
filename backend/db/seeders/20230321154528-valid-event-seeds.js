'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Events';
    return queryInterface.bulkInsert(options, [
      {
        venueId: 1,
        groupId: 1,
        name: 'Sousou',
        description: 'Magic and fun',
        type: 'In person',
        capacity: '10',
        price: 87,
        startDate: '2023-9-19 20:00:00',
        endDate: '2023-9-19 22:00:00',
      },
      {
        venueId: 2,
        groupId: 2,
        name: 'No',
        description: 'Counting numbers',
        type: 'Online',
        capacity: '10',
        price: 87,
        startDate: '2023-5-19 20:00:00',
        endDate: '2023-6-19 22:00:00',
      },
      {
        venueId: 3,
        groupId: 3,
        name: 'Frieren',
        description: 'Primordial eternity',
        type: 'Online',
        capacity: '10',
        price: 87,
        startDate: '2023-5-19 8:00:00',
        endDate: '2023-6-19 20:00:00',
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      type: { [Op.in]: ['In person', 'Online'] }
    }, {});
  }
};
