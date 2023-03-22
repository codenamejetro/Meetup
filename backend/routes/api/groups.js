const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, Membership, GroupImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];

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

    res.json(finalArr)
  })

module.exports = router;
