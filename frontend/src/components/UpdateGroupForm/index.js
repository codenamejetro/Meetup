import { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useHistory, useParams } from "react-router-dom"
import { fetchOneGroupThunk, updateGroupThunk, fetchGroupsThunk } from "../../store/groups"


function UpdateGroupForm({currId}) {
    const { groupId } = useParams()
    const dispatch = useDispatch()
    const history = useHistory()

    const sessionUser = useSelector(state => state.session.user);
    const allGroups = useSelector(state => state.groups.allGroups);
    const singleGroupImage = useSelector(state => state.groups.singleGroup.GroupImages)
    const group = allGroups[groupId]
    console.log(group)

    const [location, setLocation] = useState(group.city + ', ' + group.state)
    const [groupName, setGroupName] = useState(group.name)
    const [groupAbout, setGroupAbout] = useState(group.about)
    const [online, setOnline] = useState(group.type)
    const [url, setUrl] = useState('');
    const [isPrivate, setIsPrivate] = useState(group.private)
    const [img, setImg] = useState(singleGroupImage.length > 0 ? singleGroupImage[0].url : '')
    const [err, setErr] = useState({})
    const [displayErr, setDisplayErr] = useState(false)

    if (!sessionUser || sessionUser.id !== group.organizerId) history.push('/')

    useEffect(() => {
        // console.log('the currId ', groupId)
        dispatch(fetchGroupsThunk())
        dispatch(fetchOneGroupThunk(groupId))
    }, [dispatch])

    useEffect(() => {
        const errors = {}
        if (!location) errors.location = "Location is required"
        if (!groupName) errors.groupName = "Name is required"
        if (groupAbout.length < 31) errors.groupAbout = "Description must be at least 30 characters long"
        if (online !== 'Online' && online !== 'In person') errors.online = "Group Type is required"
        if (isPrivate !== true && isPrivate !== false) errors.isPrivate = "Visibility Type is required"
        // if (!img.endsWith('.png') && !img.endsWith('.jpg') && !img.endsWith('.jpeg')) errors.img = "Image URL needs to end in jpg or png"
        setErr(errors)
    }, [location, groupName, groupAbout, online, isPrivate, img])

    const onSubmit = (e) => {
        e.preventDefault()
        if (Object.keys(err).length > 0) {
            setDisplayErr(true)
        }
        else {
            const locationSeparated = location.split(', ')
            const group = { name: groupName, about: groupAbout, type: online, private: isPrivate, city: locationSeparated[0], state: locationSeparated[1] }

            dispatch(updateGroupThunk(group, groupId))

            setUrl(`/groups/${groupId}`)

        }
    }

    if (!group) return null
    if (!allGroups) return null
    if (!singleGroupImage) return null

    return (
        <>
            {url && <Redirect to={url} />}
            <div className='create-form-huge-wrapper'>

                <div className='create-form-separating-line create-form-top'>
                    <p className="create-form-top-first">UPDATE YOUR GROUP'S INFORMATION</p>
                    <h2 className="create-form-top-second">We'll walk you through a few steps to update your group's information</h2>
                </div>
                <form onSubmit={onSubmit}>

                    <div className="create-form-separating-line">
                        <label className="create-form-label-location" >
                            <h2>First, set your group's location.</h2>
                            <p>SeparateDown groups meet locally, in person and online. We'll connect you with people
                                in your area, and more can join you online.</p>
                            <input
                                type="text"
                                name="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder={'City, STATE'}

                            />
                        </label>
                    </div>
                    {displayErr === true && err.location && (<p className="errors">· {err.location}</p>)}

                    <div className="create-form-separating-line">
                    <label className="create-form-label-name">
                        <h2>What will your group's name be?</h2>
                        <p>Choose a name that will give people a clear idea of what the group is about.
                            Feel free to get creative! You can edit this later if you change your mind.</p>
                        <input
                            type="text"
                            name="group-name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder={'What is your group name?'}
                        />
                    </label>
                    </div>
                    {displayErr === true && err.groupName && (<p className="errors">· {err.groupName}</p>)}

                    <div className="create-form-separating-line">
                    <label htmlFor='group-about'>
                        <h2>Now describe what your group will be about</h2>
                        <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>
                        <div className="create-form-label-about-list">
                            1, What's the purpose of the group? <br />
                            2. Who should join? <br />
                            3. What will you do at your events?
                        </div>
                        <textarea id='group-about' name='group-about' rows={'5'} cols={'50'} value={groupAbout} onChange={(e) => setGroupAbout(e.target.value)} placeholder={'Please write at least 30 characters'}></textarea>
                    </label>
                    {displayErr === true && err.groupAbout && (<p className="errors">· {err.groupAbout}</p>)}
                    </div>

                    <div className="create-form-separating-line">
                    <label>
                        <h2>Final steps...</h2>
                        <p>Is this an in person or online group?</p>
                        <select
                            value={online}
                            onChange={(e) => setOnline(e.target.value)}
                        >
                            <option value="" disabled>(select-one)</option>

                            <option value='In person' key={'in-person'}>
                                In person
                            </option>
                            <option value='Online' key={'online'}>
                                Online
                            </option>
                        </select>

                        {displayErr === true && err.online && (<p className="errors">· {err.online}</p>)}
                        <p>Is this group private or public?</p>
                        <select
                            value={isPrivate}
                            onChange={(e) => setIsPrivate(!isPrivate)}
                        >
                            <option value='' disabled>(select-one)</option>

                            <option value={false} key={'public'}>
                                Public
                            </option>
                            <option value={true} key={true}>
                                Private
                            </option>
                        </select>
                        {displayErr === true && err.isPrivate && (<p className="errors">· {err.isPrivate}</p>)}

                        </label>
                        </div>

                        {/* <p>Please add an image url for your group below:</p>
                        <input
                            type="text"
                            name="img"
                            value={img}
                            onChange={(e) => setImg(e.target.value)}
                            placeholder={'Image Url'}
                        />
                    {displayErr === true && err.img && (<p className="errors">· {err.img}</p>)} */}

                    <div className="create-form-submit-button-wrapper">
                    <button className="create-form-submit-button" type='submit' >Update Group</button>

                    </div>

                </form>
            </div>
        </>
    )
}

export default UpdateGroupForm
