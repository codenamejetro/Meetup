'use strict';
const bcrypt = require("bcryptjs");

const { GroupImage } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'GroupImages';
    return queryInterface.bulkInsert(options, [
      {
        groupId: '1',
        url: 'groupimg1.com',
        preview: true
      },
      {
        groupId: '2',
        url: 'groupimg2.net',
        preview: false
      },
      {
        groupId: '3',
        url: 'groupimg3.org',
        preview: true
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      preview: { [Op.in]: [true, false] }
    }, {});
  }
};
