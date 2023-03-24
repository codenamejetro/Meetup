const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, User, Venue, Membership, GroupImage, Event, Attendance, EventImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const validateCreateEvent = [
    check('venue')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isIn()
        .withMessage('Venue does not exist'),
    check('name')
        .exists({ checkFalsy: true })
        .notEmpty().isLength({ min: 5 })
        .withMessage('Name must be at least 5 characters'),
    check('type').exists({ checkFalsy: true })
        .exists({ checkFalsy: true })
        .notEmpty().isIn(['Online', 'In person'])
        .withMessage('Type must be Online or In person'),
    check('capacity')
        .notEmpty()
        .isInt()
        .withMessage(`Capacity must be an integer`),
    check('price')
        .exists({ checkFalsy: true })
        .notEmpty().isNumeric()
        .withMessage('Price is invalid'),
    check('description')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Description is required'),
    check('startdDate')
        .exists({ checkFalsy: true })
        .notEmpty().isDate().isAfter('')
        .withMessage('Start date must be in the future'),
    check('endDate')
        .exists({ checkFalsy: true })
        .notEmpty().isDate().isBefore('startDate')
        .withMessage('End date is less than start date'),
    handleValidationErrors
]


//Get event by id
router.get('/:id', async (req, res) => {
    const eventImageArr = []
    const countAttendeeObj = {}

    const theNumAttending = await Attendance.count({
        where: { eventId: req.params.id }
    })
    // const attendees = await Attendance.findAll({
    //     where: { eventId: req.params.id }
    // })
    // attendees.forEach(attendees => {
    //     if (countAttendeeObj[attendees["eventId"]]) countAttendeeObj[attendees["eventId"]] += 1
    //     else countAttendeeObj[attendees["eventId"]] = 1
    // })

    const theEvent = await Event.findByPk(req.params.id, {
        attributes: { exclude: ["createdAt", "updatedAt"] }
    })
    let copiedTheEvent = JSON.parse(JSON.stringify(theEvent))
    const theEventGroupId = theEvent.groupId

    const theGroup = await Group.findOne({
        attributes: { exclude: ["organizerId", "about", "type", "createdAt", "updatedAt"] },
        where: { id: theEventGroupId }
    })
    const theVenue = await Venue.findOne({
        attributes: { exclude: ["groupId", "createdAt", "updatedAt"] }
    })
    const theEventImages = await EventImage.findAll({
        attributes: { exclude: ["eventId", "createdAt", "updatedAt"] },
        where: { eventId: theEvent.id }
    })

    const groupJSON = theGroup.toJSON()
    const venueJSON = theVenue.toJSON()
    theEventImages.forEach(eventImage => {
        const eventImageJSON = eventImage.toJSON()
        eventImageArr.push(eventImageJSON)
    })

    copiedTheEvent["numAttending"] = theNumAttending
    copiedTheEvent["Group"] = groupJSON
    copiedTheEvent["Venue"] = venueJSON
    copiedTheEvent["EventImages"] = eventImageArr

    res.json(copiedTheEvent)
})

//Get all events //start date end date not showing up null in response
router.get('/', async (req, res) => {
    const finalArr = []
    const countAttObj = {}
    const imgObj = {}
    const groupObj = {}
    const venueObj = {}

    const theEvents = await Event.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] }
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
        attributes: ["id", "name", "city", "state"]
    })
    groups.forEach(eachGroup => {
        const groupJSON = eachGroup.toJSON()
        if (!groupObj[groupJSON["id"]]) groupObj[groupJSON["id"]] = groupJSON
    })

    const venues = await Venue.findAll({
        attributes: ["id", "city", "state"]
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



    res.json({ Events: finalArr })
})

//Add image to event based on event's id
router.post('/:id/images', requireAuth, async (req, res, next) => {
    const theEvent = await Event.findByPk(req.params.id)
    const findAttendEvent = await Attendance.findOne({
        where: {
            userId: req.user.id,
            eventId: req.params.id
        }
    })
    if (!theEvent) {
        const err = new Error(`Event couldn't be found`);
        err.status = 404;
        return next(err);
    }
    if (!findAttendEvent) {
        const err = new Error(`Forbidden`);
        err.status = 403;
        return next(err);
    }
    const { url, preview } = req.body
    const newEventImage = await EventImage.create({ eventId: req.params.id, url, preview })

    const validEventImage = {
        id: newEventImage.id,
        url: newEventImage.url,
        preview: newEventImage.preview
    }

    res.json(validEventImage)

})

//Edit an event by id //authorize organizer cohost
router.put('/:id', requireAuth, async (req, res, next) => {
    const { user } = req
    const theEvent = await Event.findByPk(req.params.id, {
        attributes: { exclude: ["createdAt", "updatedAt"] }
    })

    if (!theEvent) {
        const err = new Error(`Group couldn't be found`);
        err.status = 404;
        return next(err);
    }

    const theMembershipId = await Membership.findOne({
        attributes: ["id"],
        where: { userId: user.id }
    })
    console.log(theMembershipId.toJSON())

    if (user.id !== theGroup.organizerId && (theMembershipId.status !== 'co-host')) {
        const err = new Error(`Forbidden`);
        err.status = 403;
        return next(err);
    }

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body
    if (venueId) theEvent.venueid = venueId
    if (name) theEvent.name = name
    if (type) theEvent.type = type
    if (capacity) theEvent.capacity = capacity
    if (price) theEvent.price = price
    if (description) theEvent.description = description
    if (startDate) theEvent.startDate = startDate
    if (endDate) theEvent.endDate = endDate

    const validEvent = {
        id: theEvent.id,
        groupId: theEvent.groupId,
        venueId: theEvent.venueId,
        name: theEvent.name,
        type: theEvent.type,
        capacity: theEvent.capacity,
        price: theEvent.price,
        description: theEvent.description,
        startDate: theEvent.startDate,
        endDate: theEvent.endDate
    }

    res.json(validEvent)

})

//Delete event by id //authorize organizer cohost
router.delete('/:id', requireAuth, async (req, res, next) => {
    const theEvent = await Event.findByPk(req.params.id)
    if (!theEvent) {
        const err = new Error(`Event couldn't be found`);
        err.status = 404;
        return next(err);
    }

    theEvent.destroy()
    res.json({message: "Successfully deleted"})

})
module.exports = router
