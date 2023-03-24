const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, User, Venue, Membership, GroupImage, Event, Attendance, EventImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateCreateGroup = [
    check('name')
        .exists({ checkFalsy: true })
        .notEmpty().isLength({ max: 60 })
        .withMessage('Name must be 60 characters or less'),
    check('about')
        .exists({ checkFalsy: true })
        .notEmpty().isLength({ min: 50 })
        .withMessage('About must be 50 characters or more'),
    check('type').exists({ checkFalsy: true })
        .notEmpty()
        .isIn(['Online', 'In person'])
        .withMessage(`Type must be 'Online' or 'In person`),
    check('private').exists({ checkFalsy: true })
        .notEmpty()
        .isBoolean()
        .withMessage('Private must be a boolean'),
    check('city')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('State is required'),
    handleValidationErrors
]

const validateCreateVenue = [
    check('address')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage(`State is required`),
    check('lat').exists({ checkFalsy: true })
        .notEmpty()
        .isNumeric()
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .isNumeric()
        .withMessage('Longitude is not valid'),
    handleValidationErrors
]
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

//get members of group by group Id
router.get('/:id/members', async (req, res) => {
    // const finArr = []
    // const someObj = {}
    const membersArr = []
    const theGroup = await Group.findByPk(req.params.id, {
        attribute: ["id"]
    })
    const groupJSON = theGroup.toJSON()

    const theMembers = await Membership.findAll({
        where: {groupId: groupJSON.id}
    })
    theMembers.forEach(member => {
        membersArr.push(member.toJSON())
    })
    console.log(membersArr)

    // // membersArr.forEach(member => {
    // //     someObj[member["userId"]] = member["id"]
    // // })
    // console.log(...membersArr)

    // // const theUsers = await User.findAll({
    // //     attribute: {exclude: ["createdAt", "updatedAt"]},
    // //     where: {id: membersArr.id}
    // // })
    // theUsers.forEach(user => {
    //     finArr.push(user.toJSON())
    // })
    const theUsers = await User.findAll({
        where: {id: membersArr.usersId}
    })


    res.json({Members: finArr})
})

//Get all venues by group Id //authorize organizer cohost
router.get('/:id/venues', requireAuth, async (req, res) => {

})

//Get all events for a group by group id //check why .toString() is needed
router.get('/:id/events', async (req, res, next) => {
    const finalArr = []
    const countAttObj = {}
    const imgObj = {}
    const groupObj = {}
    const venueObj = {}

    const theEvents = await Event.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']}
    })
    // console.log(theEvents)

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
        const eventJSON = event.toJSON()
        // console.log
        console.log(eventJSON["groupId"])
        // console.log(req.params.id)
        if (eventJSON["groupId"].toString() === req.params.id.toString()) {
            finalArr.push(eventJSON)
        }
    })

    // console.log(finalArr)
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

//GET all groups joined or organized by the current user
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req
    let finalArr = []
    const countMemberObj = {}
    const urlObj = {}

    const members = await Membership.findAll()
    members.forEach(member => {
        if (countMemberObj[member["groupId"]]) countMemberObj[member["groupId"]] += 1
        else countMemberObj[member["groupId"]] = 1
    })

    const groupImages = await GroupImage.findAll()
    // console.log(groupImages)
    groupImages.forEach(image => {
        const theImage = image.toJSON()
        if (!urlObj[theImage["groupId"]]) urlObj[theImage["groupId"]] = theImage.url

    })
    const groups = await Group.findAll({ where: { organizerId: user.id } })
    groups.forEach(group => {
        finalArr.push(group.toJSON())
    })

    finalArr.forEach(group => {
        let trackId = group["id"]
        if (!group.numMembers) {
            group.numMembers = countMemberObj[trackId]
        }
        if (!group.previewImage) {
            group.previewImage = urlObj[trackId]
        }
    })

    res.json({ "Groups": finalArr })
})

//GET group by ID
router.get('/:id', async (req, res) => {
    const theGroup = await Group.findByPk(req.params.id)
    if (theGroup) {
        const theGroupId = theGroup.organizerId

        let copiedTheGroup = JSON.parse(JSON.stringify(theGroup))

        const theGroupIdFromGroupImage = await GroupImage.findAll({
            attributes: ['id', 'url', 'preview'],
            where: { groupId: theGroup.id }
        })

        const theGroupIdFromVenue = await Venue.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            where: { groupId: theGroup.id }
        })

        const theOrgIdFromUser = await User.findByPk(theGroupId, {
            attributes: { exclude: ['username'] }
        })

        copiedTheGroup["GroupImages"] = theGroupIdFromGroupImage
        copiedTheGroup["Organizer"] = theOrgIdFromUser
        copiedTheGroup["Venues"] = theGroupIdFromVenue

        res.json(copiedTheGroup)
    }
    else res.status(404).json({
        message: "group couldn't be found",
        statusCode: 404
    })
})

//GET all groups
router.get('/', async (req, res) => {
    let finalArr = []
    const countMemberObj = {}
    const urlObj = {}

    const members = await Membership.findAll()
    members.forEach(member => {
        if (countMemberObj[member["groupId"]]) countMemberObj[member["groupId"]] += 1
        else countMemberObj[member["groupId"]] = 1
    })

    const groupImages = await GroupImage.findAll()
    // console.log(groupImages)
    groupImages.forEach(image => {
        const theImage = image.toJSON()
        if (!urlObj[theImage["groupId"]]) urlObj[theImage["groupId"]] = theImage.url

    })
    const groups = await Group.findAll()
    groups.forEach(group => {
        finalArr.push(group.toJSON())
    })

    finalArr.forEach(group => {
        let trackId = group["id"]
        if (!group.numMembers) {
            group.numMembers = countMemberObj[trackId]
        }
        if (!group.previewImage) {
            group.previewImage = urlObj[trackId]
        }
    })

    res.json({ "Groups": finalArr })
})

//Create venue for group specified by id //authorize organizer cohost
router.post('/:id/venues', validateCreateVenue, requireAuth, async (req, res, next) => {
    const { user } = req
    const theGroup = await Group.findByPk(req.params.id)
    console.log(theGroup.toJSON())
    console.log(user.id)
    if (!theGroup) {
        const err = new Error(`Group couldn't be found`);
        err.status = 404;
        return next(err);
    }




    else {
        const { address, city, state, lat, lng } = req.body
        const theGroupWhereUserId = await Membership.findOne({
            where: { userId: user.id }
        })
        const newVenue = await Venue.create({ groupId: theGroupWhereUserId["groupId"], address, city, state, lat, lng })

        validVenue = {
            id: newVenue.id,
            groupId: theGroupWhereUserId["groupId"],
            address: newVenue.address,
            city: newVenue.city,
            state: newVenue.state,
            lat: newVenue.lat,
            lng: newVenue.lng,
        }
        // await setTokenCookie(res, validVenue);

        return res.json(validVenue);

    }


})

//Add image to group based on group's id
router.post('/:id/images', requireAuth, async (req, res, next) => {
    const theGroup = await Group.findByPk(req.params.id)
    if (!theGroup) {
        const err = new Error(`Group couldn't be found`);
        err.status = 404;
        return next(err);
    }
    if (req.user.id === theGroup.organizerId) {
        const newGroupImg = await GroupImage.create({ url: req.body.url, groupId: req.params.id, preview: req.body.preview })

        const validGroupImg = {
            id: newGroupImg.id,
            url: newGroupImg.url,
            preview: newGroupImg.preview
        }

        await setTokenCookie(res, validGroupImg);

        return res.json(validGroupImg);
    }
    else {
        const err = new Error(`Forbidden`);
        err.status = 403;
        return next(err);
    }
})

//Create event for group specified by id //validateCreateEvent needs work //organizer cohost
router.post('/:id/events', validateCreateEvent ,requireAuth, async (req, res, next) => {
    const { user } = req
    const theGroup = await Group.findByPk(req.params.id)
    if (!theGroup) {
        const err = new Error(`Group couldn't be found`);
        err.status = 404;
        return next(err);
    }

    const checkIfCoHost = () => {
        const theMembership = Membership.findAll({
            where: { userId: req.user.id }
        })
        if (theMembership.status === "co-host" && theMembership.groupId === theGroup) return true
    }

    if (req.user.id !== theGroup.organizerId && !checkIfCoHost()) {
        const err = new Error(`Forbidden`);
        err.status = 403;
        return next(err);
    } else {
        const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body
        const newEvent = await Event.create({ groupId: req.params.id, venueId , name, type, capacity, price, description, startDate, endDate })

        const validEvent = {
            id: newEvent.id,
            groupId: req.params.id,
            venueId: newEvent.venueId,
            name: newEvent.name,
            type: newEvent.type,
            capacity: newEvent.capacity,
            price: newEvent.price,
            description: newEvent.description,
            startDate: newEvent.startDate,
            endDate: newEvent.endDate
        }

        res.json(validEvent)
    }
})

//Create a group
router.post('/', validateCreateGroup, requireAuth, async (req, res) => {
    // const { user } = req
    const { name, about, type, private, city, state } = req.body
    const group = await Group.create({ name, organizerId: req.user.id, about, type, private, city, state })


    const validGroup = {
        id: group.id,
        organizerId: req.user.id,
        name: group.name,
        about: group.about,
        type: group.type,
        private: group.private,
        city: group.city,
        state: group.state,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt
    };

    await setTokenCookie(res, validGroup);

    return res.json(validGroup);
})

//Edit a group
router.put('/:id', validateCreateGroup, requireAuth, async (req, res, next) => {
    const theGroup = await Group.findByPk(req.params.id)
    if (!theGroup) {
        const err = new Error(`Group couldn't be found`);
        err.status = 404;
        return next(err);
    }
    if (req.user.id !== theGroup.organizerId) {
        const err = new Error(`Forbidden`);
        err.status = 403;
        return next(err);
    } else {
        const { name, about, type, private, city, state } = req.body
        if (name) theGroup.name = name
        if (about) theGroup.about = about
        if (type) theGroup.type = type
        if (private) theGroup.private = private
        if (city) theGroup.city = city
        if (state) theGroup.state = state

    }

    res.json(theGroup)
})

//Delete group
router.delete('/:id', requireAuth, async (req, res, next) => {
    const theGroup = await Group.findByPk(req.params.id)
    if (!theGroup) {
        const err = new Error(`Group couldn't be found`);
        err.status = 404;
        return next(err);
    }
    if (req.user.id !== theGroup.organizerId) {
        const err = new Error(`Forbidden`);
        err.status = 403;
        return next(err);
    } else {
        theGroup.destroy()
        return res.json({
            message: 'success',
            statusCode: 200
        })
    }
})

module.exports = router;


// const theMembershipId = await Membership.findOne({
//     attributes: ["id"],
//     where: { userId: user.id }
// })
// const membershipIdJSON = theMembershipId.toJSON()

// const theMembership = await Membership.findOne({
//     where: {id: membershipIdJSON.id}
// })

// if (!(theMembership.groupId === theGroup && theMembership.status !== 'organizer') && (!theMembership.groupId === theGroup && theMembership.status !== 'co-host')) {
//     const err = new Error(`Forbidden`);
//     err.status = 403;
//     return next(err);
// }

// const checkIfCoHost = () => {
//     const theMembership = Membership.findAll({
//         where: { userId: user.id }
//     })
//     if (theMembership.status === "co-host" && theMembership.groupId === theGroup) {
//         return true
//     }
// }

// if (user.id !== theGroup.organizerId && !checkIfCoHost) {
//     const err = new Error(`Forbidden`);
//     err.status = 403;
//     return next(err);
// }
