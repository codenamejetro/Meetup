'use strict';

const { EventImage } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const validEventImage = [
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
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await EventImage.bulkCreate(validEventImage, options, {
        validate: true,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    for (let eventImageInfo of validEventImage) {
      try {
        await EventImage.destroy(options, {
          where: eventImageInfo
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
};
