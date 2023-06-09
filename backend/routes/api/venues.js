const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, User, Venue, Membership, GroupImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
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

//edit venue by id
router.put('/:id', validateCreateVenue, requireAuth, async (req, res, next) => {
    const theVenue = await Venue.findByPk(req.params.id)
    if (!theVenue) {
        const err = new Error(`Venue couldn't be found`);
        err.status = 404;
        return next(err);
    }
    const justUserIdsArr = []
    const organizerCohostArr = []
    const membersArr = []
    const { user } = req

    const theMembers = await Membership.findAll({
        where: {groupId: req.params.id}
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

    } else {
        const { address, city, state, lat, lng } = req.body
        if (address) theVenue.address = address
        if (city) theVenue.city = city
        if (state) theVenue.state = state
        if (lat) theVenue.lat = lat
        if (lng) theVenue.city = lng

        const validVenue = {
            id: theVenue.id,
            groupId: theVenue.id,
            address: theVenue.address,
            city: theVenue.city,
            state: theVenue.state,
            lat: theVenue.lat,
            lng: theVenue.lng
        }
        res.json(validVenue)
    }

})

module.exports = router;
