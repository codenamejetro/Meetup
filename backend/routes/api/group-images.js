const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, User, Venue, Membership, GroupImage, Event, Attendance, EventImage, groupImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { or } = require('sequelize');

router.delete('/:id', requireAuth, async (req, res, next) => {
    const theGroupImage = await GroupImage.findByPk(req.params.id)
    if (!theGroupImage) {
        const err = new Error(`Event Image couldn't be found`);
        err.status = 404;
        return next(err);
    }

    const justUserIdsArr = []
    const organizerCohostArr = []
    const membersArr = []
    const { user } = req

    // const theGroupId = theGroupImage.id
    // const theGroupId = await Event.findOne({
    //     attributes: ["groupId"],
    //     where: {id: theEventId}
    // })

    const theMembers = await Membership.findAll({
        where: { groupId: theGroupImage.groupId }
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

    theGroupImage.destroy()
    res.json({message: "Successfully deleted", statusCode: 200})
})

module.exports = router
