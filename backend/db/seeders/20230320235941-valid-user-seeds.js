'use strict';

const { User } = require('../models')

const validUser = [
  {
    firtName: 'Kevin',
    lastName: 'Penkin',
    username: 'kevinP',
    email: 'kevin.p@gmail.com',
    hashedPassword: 'hashedpw1'
  },
  {
    firtName: 'Hiroyuki',
    lastName: 'Sawano',
    username: 'hiroyukiS',
    email: 'hiroyuki.s@gmail.com',
    hashedPassword: 'hashedpw2'
  },
  {
    firtName: 'Kohta',
    lastName: 'Yamamoto',
    username: 'kohtaY',
    email: 'kevin.y@gmail.com',
    hashedPassword: 'hashedpw3'
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
