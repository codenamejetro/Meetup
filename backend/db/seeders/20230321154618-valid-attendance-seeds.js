'use strict';

const { Attendance } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const validAttendance = [
  {
    eventId: 1,
    userId: 1,
    status: 'member'
  },
  {
    eventId: 2,
    userId: 2,
    status: 'waitlist'
  },
  {
    eventId: 3,
    userId: 3,
    status: 'pending'
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await Attendance.bulkCreate(validAttendance, options, {
        validate: true,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    for (let attendanceInfo of validAttendance) {
      try {
        await Attendance.destroy(options, {
          where: attendanceInfo
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
};
