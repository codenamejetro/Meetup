const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, User, Venue, Membership, GroupImage, Event, Attendance, EventImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const validateCreateEvent = [
    check('venueId')
        .exists({ checkFalsy: true })
        .notEmpty()
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
    check('startDate')
        .exists({ checkFalsy: true })
        .notEmpty().isISO8601()
        .withMessage('Start date must be in the future'),
    check('endDate')
        .exists({ checkFalsy: true })
        .notEmpty().isISO8601().custom((value, {req}) => {
            if(Date.parse(value) < Date.parse(req.body.startDate)) {
                throw new Error('End date is less than start date')
            }
            return true
        })
        .withMessage('End date is less than start date'),
    handleValidationErrors
]

//get all attendees to event
router.get('/:id/attendees', async (req, res, next) => {
    const finArr = []
    const userIdArr = []
    const attendeeArr = []
    const statusObj = {}
    let booleanCheck = false
    const theEvent = await Event.findByPk(req.params.id, {
        // attributes: ["id"]
    })
    if (!theEvent) {
        const err = new Error(`Event couldn't be found`);
        err.status = 404;
        return next(err);
    }

    const justUserIdsArr = []
    const organizerCohostArr = []
    const membersArr = []
    const { user } = req

    const theMembers = await Membership.findAll({
        where: { groupId: theEvent.groupId }
    })

    theMembers.forEach(member => {
        membersArr.push(member.toJSON())
    })
    membersArr.forEach(member => {
        if (member.status === 'organizer' || member.status === 'co-host') {
            organizerCohostArr.push(member)
        }
    })
    organizerCohostArr.forEach(member => {
        justUserIdsArr.push(member.userId)
    })

    if (justUserIdsArr.includes(user.id)) {
        booleanCheck = true
    }
    const theEventId = theEvent.toJSON()["id"]

    const theAttendees = await Attendance.findAll({
        where: { eventId: theEventId }
    })
    theAttendees.forEach(attendee => {
        attendeeArr.push(attendee.toJSON())
    })
    attendeeArr.forEach(user => {
        userIdArr.push(user.userId)
    })
    const theUsers = await User.scope(["notDefault"]).findAll({
        where: { id: userIdArr }
    })
    theUsers.forEach(user => {
        finArr.push(user.toJSON())
    })
    const theMemberships = await Membership.findAll()
    theMemberships.forEach(membership => {
        const membershipJSON = membership.toJSON()
        if (!statusObj[membershipJSON["userId"]]) statusObj[membershipJSON["userId"]] = membershipJSON.status

    })

    finArr.forEach(user => {
        let trackId = user["id"]
        if (!user.Attendance) {
            user.Attendance = { status: statusObj[trackId] }
        }
    })
    if (!booleanCheck) {
        for (let i = 0; i < finArr.length; i++) {
            const ele = finArr[i];
            if (ele.Attendance.status === 'pending') {
                finArr.splice(i, 1)
                i--
            }
        }
    }

    res.json({ Attendees: finArr })
})

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
    let { page, size, name, type, startDate } = req.query;

    const where = {}

    page = parseInt(page);
    size = parseInt(size);

    if (Number.isNaN(page)) page = 0;
    if (Number.isNaN(size)) size = 20;

    const pagination = {};
    if (page >= 1 && size >= 1) {
        pagination.limit = size;
        pagination.offset = size * (page - 1);
    }
    if (page >= 11) {
        pagination.offset = size * 10;
    }
    if (size >= 21) {
        pagination.limit = 20;
    }

    req.pagination = pagination

    const finalArr = []
    const countAttObj = {}
    const imgObj = {}
    const groupObj = {}
    const venueObj = {}

    if (name && name !== '') {
        where.name = name
    }

    if (type && type !== '') {
        where.type = type
    }

    if (startDate && startDate !== '') {
        where.startDate = startDate
    }

    const theEvents = await Event.findAll({
        include: [{
            model: Group, attributes: ['id', 'name', 'city', 'state']
         }, {
            model: Venue, attributes: ['id', 'city', 'state']
         }],
        where,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        ...pagination
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

    // const groups = await Group.findAll({
    //     attributes: ["id", "name", "city", "state"]
    // })
    // groups.forEach(eachGroup => {
    //     const groupJSON = eachGroup.toJSON()
    //     if (!groupObj[groupJSON["id"]]) groupObj[groupJSON["id"]] = groupJSON
    // })

    // const venues = await Venue.findAll({
    //     attributes: ["id", "city", "state"]
    // })
    // venues.forEach(eachVenue => {
    //     const venueJSON = eachVenue.toJSON()
    //     if (!venueObj[venueJSON["id"]]) venueObj[venueJSON["id"]] = venueJSON
    // })

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



    res.json({ Events: finalArr
        // , page, size
    })
})

//Request to attend event based on event id
router.post('/:id/attendance', requireAuth, async (req, res, next) => {
    const { user } = req
    const theEvent = await Event.findByPk(req.params.id, {

    })
    if (!theEvent) {
        const err = new Error(`Event couldn't be found`);
        err.status = 404;
        return next(err);
    }
    const theUserId = user.id
    const theGroupId = theEvent.groupId
    const theMembership = await Membership.findOne({
        where: {
            userId: theUserId,
            groupId: theGroupId
        }
    })
    if (!theMembership) {
        const err = new Error(`Forbidden`);
        err.status = 403;
        return next(err);
    }
    const theAttendances = await Attendance.findAll({
        where: { eventId: theEvent.id }
    })
    theAttendances.forEach(attendance => {
        if (attendance.userId === user.id) {
            if (attendance.status === 'pending') {
                const err = new Error(`Attendance has already been requested`);
                err.status = 400;
                return next(err);
            }
            if (attendance.status === 'member') {
                const err = new Error(`User is already an attendee of the event`);
                err.status = 400;
                return next(err);
            }
        }
    })


    const theAttendance = await Attendance.create({ eventId: parseInt(req.params.id), userId: user.id, status: 'pending' })
    const validAttendance = {
        eventId: theAttendance.eventId,
        userId: theAttendance.userId,
        status: theAttendance.status
    }

    res.json(validAttendance)
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

//Change the status of an attendance for an event by id //needs set save
router.put('/:id/attendance', requireAuth, async (req, res, next) => {
    const { userId, status } = req.body
    const theEvent = await Event.findByPk(req.params.id)

    if (!theEvent) {
        const err = new Error(`Event couldn't be found`);
        err.status = 404;
        return next(err);
    }
    if (status === 'pending') {
        const err = new Error(`Cannot change attendance status to pending`);
        err.status = 400;
        return next(err);
    }

    const attendanceArr = []
    const justUserIdsArr = []
    const organizerCohostArr = []
    const membersArr = []
    const { user } = req

    const theMembers = await Membership.findAll({
        where: { groupId: theEvent.groupId }
    })
    theMembers.forEach(member => {
        membersArr.push(member.toJSON())
    })
    membersArr.forEach(member => {
        if (member.status === 'organizer' || member.status === 'co-host') {
            organizerCohostArr.push(member)
        }
    })
    organizerCohostArr.forEach(member => {
        justUserIdsArr.push(member.userId)
    })
    if (!justUserIdsArr.includes(user.id)) {
        const err = new Error(`Forbidden`);
        err.status = 403;
        return next(err);
    }

    const theAttendance = await Attendance.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: {
            eventId: theEvent.id,
            userId: userId
        }
    })
    if (!theAttendance) {
        const err = new Error(`Attendance between the user and the event does not exist`);
        err.status = 404;
        return next(err);
    }

    theAttendance.status = status

    res.json(theAttendance)


})

//Edit an event by id
router.put('/:id', validateCreateEvent, requireAuth, async (req, res, next) => {
    const { user } = req
    const theEvent = await Event.findByPk(req.params.id, {
        attributes: { exclude: ["createdAt", "updatedAt"] }
    })

    if (!theEvent) {
        const err = new Error(`Group couldn't be found`);
        err.status = 404;
        return next(err);
    }

    const justUserIdsArr = []
    const organizerCohostArr = []
    const membersArr = []

    const theMembers = await Membership.findAll({
        where: { groupId: req.params.id }
    })
    theMembers.forEach(member => {
        membersArr.push(member.toJSON())
    })
    membersArr.forEach(member => {
        if (member.status === 'organizer' || member.status === 'co-host') {
            organizerCohostArr.push(member)
        }
    })
    organizerCohostArr.forEach(member => {
        justUserIdsArr.push(member.userId)
    })
    if (!justUserIdsArr.includes(user.id)) {
        const err = new Error(`Forbidden`);
        err.status = 403;
        return next(err);
    }

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body
    if (venueId) theEvent.venueId = venueId
    if (name) theEvent.name = name
    if (type) theEvent.type = type
    if (capacity) theEvent.capacity = capacity
    if (price) theEvent.price = price
    if (description) theEvent.description = description
    if (startDate) theEvent.startDate = startDate
    if (endDate) theEvent.endDate = endDate

    theEvent.set({
        venueId: venueId,
        name: name,
        type: type,
        capacity: capacity,
        price: price,
        description: description,
        startDate: startDate,
        endDate: endDate
    })

    theEvent.save()

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

//
router.delete('/:id/attendance', requireAuth, async (req, res, next) => {
    const { user } = req
    const { userId } = req.body
    const theEvent = await Event.findByPk(req.params.id)

    if (!theEvent) {
        const err = new Error(`Event couldn't be found`);
        err.status = 404;
        return next(err);
    }

    const theAttendance = await Attendance.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: {
            eventId: theEvent.id,
            userId: userId
        }
    })
    if (!theAttendance) {
        const err = new Error(`Attendance does not exist for this user`);
        err.status = 404;
        return next(err);
    }


    const organizerMemberArr = []
    const membersArr = []

    const theMembers = await Membership.findAll({
        where: { groupId: theEvent.groupId }
    })
    theMembers.forEach(member => {
        membersArr.push(member.toJSON())
    })
    membersArr.forEach(member => {
        if (member.status === 'organizer') organizerMemberArr.push(member.userId)
    })
    organizerMemberArr.push(user.id)
    if (!organizerMemberArr.includes(userId)) {
        const err = new Error(`Only the User or organizer may delete an Attendance`);
        err.status = 403;
        return next(err);
    }

    theAttendance.destroy()
    res.json({ message: "Successfully deleted attendance from event" })
})

//Delete event by id
router.delete('/:id', requireAuth, async (req, res, next) => {
    const theEvent = await Event.findByPk(req.params.id)
    if (!theEvent) {
        const err = new Error(`Event couldn't be found`);
        err.status = 404;
        return next(err);
    }

    const justUserIdsArr = []
    const organizerCohostArr = []
    const membersArr = []
    const { user } = req

    const theMembers = await Membership.findAll({
        where: { groupId: req.params.id }
    })
    theMembers.forEach(member => {
        membersArr.push(member.toJSON())
    })
    membersArr.forEach(member => {
        if (member.status === 'organizer' || member.status === 'co-host') {
            organizerCohostArr.push(member)
        }
    })
    organizerCohostArr.forEach(member => {
        justUserIdsArr.push(member.userId)
    })
    if (!justUserIdsArr.includes(user.id)) {
        const err = new Error(`Forbidden`);
        err.status = 403;
        return next(err);
    }

    theEvent.destroy()
    res.json({ message: "Successfully deleted" })

})
module.exports = router

// let { page, size, name, type, startDate } = req.query;

//     const where = {}

//     page = parseInt(page);
//     size = parseInt(size);

//     if (Number.isNaN(page)) page = 0;
//     if (Number.isNaN(size)) size = 20;

//     const pagination = {};
//     if (page >= 1 && size >= 1) {
//         pagination.limit = size;
//         pagination.offset = size * (page - 1);
//     }
//     if (page >= 11) {
//         pagination.offset = size * 10;
//     }
//     if (size >= 21) {
//         pagination.limit = 20;
//     }

//     req.pagination = pagination

//     const finalArr = []
//     const countAttObj = {}
//     const imgObj = {}
//     const groupObj = {}
//     const venueObj = {}

//     if (name && name !== '') {
//         where.name = name
//     }

//     if (type && type !== '') {
//         where.type = type
//     }

//     if (startDate && startDate !== '') {
//         where.startDate = startDate
//     }

//     const theEvents = await Event.findAll({
//         where,
//         attributes: { exclude: ['createdAt', 'updatedAt'] },
//         ...pagination
//     })

//     const attendances = await Attendance.findAll()
//     attendances.forEach(attendee => {
//         if (countAttObj[attendee["eventId"]]) countAttObj[attendee["eventId"]] += 1
//         else countAttObj[attendee["eventId"]] = 1
//     })

//     const eventImages = await EventImage.findAll()
//     eventImages.forEach(eachImg => {
//         const imgJSON = eachImg.toJSON()
//         if (!imgObj[imgJSON["eventId"]]) imgObj[imgJSON["eventId"]] = imgJSON.url
//     })

//     const groups = await Group.findAll({
//         attributes: ["id", "name", "city", "state"]
//     })
//     groups.forEach(eachGroup => {
//         const groupJSON = eachGroup.toJSON()
//         if (!groupObj[groupJSON["id"]]) groupObj[groupJSON["id"]] = groupJSON
//     })

//     const venues = await Venue.findAll({
//         attributes: ["id", "city", "state"]
//     })
//     venues.forEach(eachVenue => {
//         const venueJSON = eachVenue.toJSON()
//         if (!venueObj[venueJSON["id"]]) venueObj[venueJSON["id"]] = venueJSON
//     })

//     theEvents.forEach(event => {
//         finalArr.push(event.toJSON())
//     })

//     finalArr.forEach(eachEvent => {
//         let trackId = eachEvent["id"]
//         if (!eachEvent.numAttending) {
//             eachEvent.numAttending = countAttObj[trackId]
//         }
//         if (!eachEvent.previewImage) {
//             eachEvent.previewImage = imgObj[trackId]
//         }
//         if (!eachEvent.Group) {
//             eachEvent.Group = groupObj[trackId]
//         }
//         if (!eachEvent.Venue) {
//             eachEvent.Venue = venueObj[trackId]
//         }
//     });



//     res.json({ Events: finalArr
//         // , page, size
//     })
