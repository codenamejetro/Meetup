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
        url: 'https://cdn.vox-cdn.com/thumbor/JK4_CZlukT2PySw2zOgPTdcltyo=/0x0:2000x1333/1200x675/filters:focal(840x507:1160x827)/cdn.vox-cdn.com/uploads/chorus_image/image/72166572/2021.12.03___The_Madrigal_Opening_Joseph_Weaver_8563.0.jpg',
        preview: true
      },
      {
        groupId: '2',
        url: 'https://visittallahassee.com/wp-content/uploads/2021/11/Tallahassee_Skyline.jpg',
        preview: false
      },
      {
        groupId: '3',
        url: 'https://images.squarespace-cdn.com/content/v1/55281d2fe4b0c285845b5303/1596706838415-RFCVDRQ22WJB1FMQ3TB4/MI%2BTransparent%2BLogo.jpg',
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
