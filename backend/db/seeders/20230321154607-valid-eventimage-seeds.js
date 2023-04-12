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
        url: "https://www.mercurynews.com/wp-content/uploads/2020/07/SJM-L-GIANTS-0722-45.jpg",
        preview: true,
      },
      {
        eventId: 2,
        url: "https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,f_jpg,g_xy_center,h_636,q_65,w_639,x_960,y_415/v1/clients/southshore/Shelf_Ice_Lake_Michigan_Rafi_Wilkinson_f6c45485-fb83-470a-ba29-eaf6c8fcd148.jpg",
        preview: true,
      },
      {
        eventId: 3,
        url: "https://floridatrippers.com/wp-content/uploads/2020/07/Best-Beaches-in-Florida-Fort-Myers-1-1000x900.jpg",
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
