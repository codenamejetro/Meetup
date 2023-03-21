'use strict';

const { GroupImage } = require('../models')

const validGroupImage = [
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
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await GroupImage.bulkCreate(validGroupImage, {
        validate: true,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    for (let groupImageInfo of validGroupImage) {
      try {
        await GroupImage.destroy({
          where: groupImageInfo
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
};
