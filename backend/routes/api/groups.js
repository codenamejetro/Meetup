const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, User, Venue, Membership, GroupImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Please provide a valid email or username.'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a password.'),
    handleValidationErrors
  ];

  //GET all groups joined or organized by the current user
  router.get('/current', validateLogin, async (req, res) => {
    const { user } = req
    const finalArr = []
      const members = await Membership.findAll()

      const groups = await Group.findAll({where: {organizerId: user.id}})
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

    res.json({"Groups": finalArr})
  })

  //GET group by ID
  router.get('/:id', async (req, res) => {
    const theGroup = await Group.findByPk(req.params.id)
    const theGroupId = theGroup.organizerId

    let copiedTheGroup = JSON.parse(JSON.stringify(theGroup))

    const theGroupIdFromGroupImage = await GroupImage.findAll({
        attributes: ['id', 'url', 'preview'],
        where: {groupId: theGroup.id}
    })

    const theGroupIdFromVenue = await Venue.findAll({
        attributes: {exclude: ['createdAt', 'updatedAt']},
        where: {groupId: theGroup.id}
    })

    const theOrgIdFromUser = await User.findByPk(theGroupId, {
        attributes: {exclude: ['username']}
    })


    copiedTheGroup["GroupImages"] = theGroupIdFromGroupImage
    copiedTheGroup["Organizer"] = theOrgIdFromUser
    copiedTheGroup["Venues"] = theGroupIdFromVenue



    res.json(copiedTheGroup)
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

    res.json({"Groups": finalArr})
  })



//   router.post('/', async (req, res))

module.exports = router;
