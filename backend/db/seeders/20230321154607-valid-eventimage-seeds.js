'use strict';
const bcrypt = require("bcryptjs");

const { EventImage } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'EventImages';
    return queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        url: "randomurl1.com",
        preview: true,
      },
      {
        eventId: 2,
        url: "randomurl2.net",
        preview: true,
      },
      {
        eventId: 3,
        url: "randomurl3.org",
        preview: true,
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
     preview: { [Op.in]: [true, false] }
    }, {});
  }
};
