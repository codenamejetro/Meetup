const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, User, Venue, Membership, GroupImage } = require('../../db/models');
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

//GET all groups joined or organized by the current user
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req
    const finalArr = []
    const members = await Membership.findAll()

    const groups = await Group.findAll({ where: { organizerId: user.id } })
    const countGroupObj = {}
    const countGroupArr = []
    for (let i = 0; i < members.length; i++) {
        countGroupArr[i] = members[i]["groupId"];

    }
    for (let i = 1; i < countGroupArr.length + 1; i++) {
        if (countGroupObj[i]) countGroupObj[i] += 1
        else countGroupObj[i] = 1
    }


    const groupImages = await GroupImage.findAll()
    const urlObj = {}
    for (let i = 0; i < groupImages.length; i++) {
        urlObj[i + 1] = groupImages[i]["url"];

    }

    groups.forEach(group => {
        finalArr.push(group.toJSON())
    })

    finalArr.forEach(eachGroup => {
        let trackId = eachGroup["id"]
        if (!eachGroup.numMembers) {
            eachGroup.numMembers = countGroupObj[trackId]
        }
        if (!eachGroup.previewImage) {
            eachGroup.previewImage = urlObj[trackId]
        }

    });

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
    const finalArr = []
    const members = await Membership.findAll()

    const groups = await Group.findAll()
    const countGroupObj = {}
    const countGroupArr = []
    for (let i = 0; i < members.length; i++) {
        countGroupArr[i] = members[i]["groupId"];

    }
    for (let i = 1; i < countGroupArr.length + 1; i++) {
        if (countGroupObj[i]) countGroupObj[i] += 1
        else countGroupObj[i] = 1
    }


    const groupImages = await GroupImage.findAll()
    const urlObj = {}
    for (let i = 0; i < groupImages.length; i++) {
        urlObj[i + 1] = groupImages[i]["url"];

    }

    groups.forEach(group => {
        finalArr.push(group.toJSON())
    })

    finalArr.forEach(eachGroup => {
        let trackId = eachGroup["id"]
        if (!eachGroup.numMembers) {
            eachGroup.numMembers = countGroupObj[trackId]
        }
        if (!eachGroup.previewImage) {
            eachGroup.previewImage = urlObj[trackId]
        }

    });

    res.json({ "Groups": finalArr })
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

//Create a group
router.post('/', validateCreateGroup, requireAuth, async (req, res) => {
    // const { user } = req
    const { name, about, type, private, city, state } = req.body
    const group = await Group.create({ name, about, type, private, city, state })


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
