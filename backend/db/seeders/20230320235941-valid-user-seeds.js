'use strict';
const bcrypt = require("bcryptjs");
const { User } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
        {
          firstName: 'Kevin',
          lastName: 'Penkin',
          username: 'kevinP',
          email: 'kevin.p@gmail.com',
          hashedPassword: bcrypt.hashSync('hashedpw1')
        },
        {
          firstName: 'Hiroyuki',
          lastName: 'Sawano',
          username: 'hiroyukiS',
          email: 'hiroyuki.s@gmail.com',
          hashedPassword: bcrypt.hashSync('hashedpw2')
        },
        {
          firstName: 'Kohta',
          lastName: 'Yamamoto',
          username: 'kohtaY',
          email: 'kevin.y@gmail.com',
          hashedPassword: bcrypt.hashSync('hashedpw3')
        }
      ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['KevinP', 'hiroyukiS', 'kohtaY'] }
    }, {});
  }
};
