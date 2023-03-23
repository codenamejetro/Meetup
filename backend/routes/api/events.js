const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, User, Venue, Membership, GroupImage, Event, Attendance, EventImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

//Get all events //start date end date not showing up null in response
router.get('/', async (req, res) => {
    const finalArr = []
    const countAttObj = {}
    const imgObj = {}
    const groupObj = {}
    const venueObj = {}

    const theEvents = await Event.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']}
    })

    const attendances = await Attendance.findAll()
    attendances.forEach(attendee => {
        if (countAttObj[attendee["eventId"]]) countAttObj[attendee["eventId"]] += 1
        else countAttObj[attendee["eventId"]] = 1
    })

    const eventImages = await EventImage.findAll()
    eventImages.forEach(eachImg => {
        const imgJSON = eachImg.toJSON()
        if (!imgObj[imgJSON["eventId"]]) imgObj[imgJSON["eventId"]] = imgJSON.url
    })

    const groups = await Group.findAll({
        attributes: [ "id", "name", "city", "state" ]
    })
    groups.forEach(eachGroup => {
        const groupJSON = eachGroup.toJSON()
        if (!groupObj[groupJSON["id"]]) groupObj[groupJSON["id"]] = groupJSON
    })

    const venues = await Venue.findAll({
        attributes: [ "id", "city", "state" ]
    })
    venues.forEach(eachVenue => {
        const venueJSON = eachVenue.toJSON()
        if (!venueObj[venueJSON["id"]]) venueObj[venueJSON["id"]] = venueJSON
    })

    theEvents.forEach(event => {
        finalArr.push(event.toJSON())
    })

    finalArr.forEach(eachEvent => {
        let trackId = eachEvent["id"]
        if (!eachEvent.numAttending) {
            eachEvent.numAttending = countAttObj[trackId]
        }
        if (!eachEvent.previewImage) {
            eachEvent.previewImage = imgObj[trackId]
        }
        if (!eachEvent.Group) {
            eachEvent.Group = groupObj[trackId]
        }
        if (!eachEvent.Venue) {
            eachEvent.Venue = venueObj[trackId]
        }
    });



    res.json({Events: finalArr})
})


module.exports = router
