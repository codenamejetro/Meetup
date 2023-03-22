'use strict';
const bcrypt = require("bcryptjs");
const { User } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const validUser = [
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
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await User.bulkCreate(validUser, {
        validate: true,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    for (let userInfo of validUser) {
      try {
        await User.destroy({
          where: userInfo
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
};
