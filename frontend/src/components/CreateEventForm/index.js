import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { createEventThunk } from "../../store/events"
import { useParams, Redirect } from "react-router-dom"
import './createEventForm.css'

function CreateEventForm() {
    const dispatch = useDispatch()
    const { groupId } = useParams()

    const [name, setName] = useState('')
    const [online, setOnline] = useState('')
    const [isPrivate, setIsPrivate] = useState('')
    const [price, setPrice] = useState('')
    const [eventStart, setEventStart] = useState('')
    const [eventEnd, setEventEnd] = useState('')
    const [img, setImg] = useState('')
    const [description, setDescription] = useState('')
    const [err, setErr] = useState({})
    const [displayErr, setDisplayErr] = useState(false)
    const [url, setUrl] = useState('');

    const sessionUser = useSelector(state => state.session.user);


    useEffect(() => {
        const errors = {}
        if (!name) errors.name = 'Name is required'
        if (online !== 'Online' && online !== 'In person') errors.online = "Event Type is required"
        if (isPrivate !== true && isPrivate !== false) errors.isPrivate = "Visibility Type is required"
        if (!price) errors.price = 'Price is required'
        if (!eventStart) errors.eventStart = 'Event start is required'
        if (!eventEnd) errors.eventEnd = 'Event end is required'
        if (!img.endsWith('.png') && !img.endsWith('.jpg') && !img.endsWith('.jpeg')) errors.img = "Image URL must end in .png .jpg or .jpeg"
        if (description.length < 31) errors.description = 'Description must be at least 30 characters long'
        setErr(errors)
    }, [name, online, isPrivate, price, eventStart, eventEnd, img, description])


    const onSubmit = async (e) => {
        e.preventDefault()
        if (Object.keys(err).length > 0) {
            setDisplayErr(true)
            return
        }
        else {
            // const locationSeparated = location.split(', ')
            const event = { venueId: 1, name: name, type: online, capacity: 5, price: price, description: description, startDate: eventStart, endDate: eventEnd }
            const newEvent = await dispatch(createEventThunk(event, groupId))

            setUrl(`/events/${newEvent.id}`)

        }
    }

    return (
        <>
            {url && <Redirect to={url} />}
            <div className="create-event-form-wrapper">
                <form onSubmit={onSubmit}>
                <div className="create-event-top">
                    <h2>Create an event for group name</h2>
                </div>

                    <div className="create-event-form-separating-line">
                        <label className="create-event-form-label-name">
                            <div>What is the name of your event?</div>
                            <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={'Event Name'}
                                style={{width:'300px'}}
                            />
                        </label>
                        {displayErr === true && err.name && (<p className="errors">· {err.name}</p>)}

                    </div>

                    <div className="create-event-form-separating-line">
                        <label >
                            <div className="create-event-form-label-online">Is this an in person or online event?</div>
                            <select
                                value={online}
                                onChange={(e) => setOnline(e.target.value)}
                                style={{width:'95px'}}
                            >
                                <option value="" disabled>(select-one)</option>

                                <option value='In person' key={'in-person'}>
                                    In person
                                </option>
                                <option value='Online' key={'online'}>
                                    Online
                                </option>
                            </select>
                        </label>
                        {displayErr === true && err.online && (<p className="errors">· {err.online}</p>)}

                        <label>
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
                        </label>
                        {displayErr === true && err.isPrivate && (<p className="errors">· {err.isPrivate}</p>)}

                        <label>
                            <div className="create-event-form-label-div-price">What is the price for your event?</div>
                            <input
                                type="text"
                                // inputmode="numeric"
                                name="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder={'0'}
                                // className='create-event-form-label-input'
                            />
                        </label>
                        {displayErr === true && err.price && (<p className="errors">· {err.price}</p>)}
                    </div>

                    <div className="create-event-form-separating-line">
                        <label>
                            <div className="create-event-form-label-startdate">When does your event start?</div>
                            <input
                                type="datetime-local"
                                name="eventStart"
                                value={eventStart}
                                onChange={(e) => setEventStart(e.target.value)}
                                placeholder={'MM/DD/YYYY HH:mm AM'}
                            />
                        </label>

                        {displayErr === true && err.eventStart && (<p className="errors">· {err.eventStart}</p>)}
                        <label>
                            <div className="create-event-form-label-enddate">When does your event end?</div>
                            <input
                                type="datetime-local"
                                name="eventEnd"
                                value={eventEnd}
                                onChange={(e) => setEventEnd(e.target.value)}
                                placeholder={'MM/DD/YYYY HH:mm PM'}
                            />
                        </label>
                        {displayErr === true && err.eventEnd && (<p className="errors">· {err.eventEnd}</p>)}
                    </div>

                    <div className="create-event-form-separating-line">
                        {/* <label> */}
                            <div className="create-event-form-label-img">Please add an image url for your group below:</div>
                            <input
                                type="text"
                                name="img"
                                value={img}
                                onChange={(e) => setImg(e.target.value)}
                                placeholder={'Image URL'}
                            />
                        {/* </label> */}
                        {displayErr === true && err.img && (<p className="errors">· {err.img}</p>)}
                    </div>

                        <div className="create-event-form-label-description">Please describe your event:</div>
                    <label htmlFor='description'>
                        <textarea id='description' name='description' rows={'5'} cols={'50'} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={'Please include at least 30 characters'}></textarea>
                    </label>
                    {displayErr === true && err.description && (<p className="errors">· {err.description}</p>)}

                    <button style={{marginTop: '20px', marginBottom: '5px', padding: '10px', color: 'white', backgroundColor: 'red', boxShadow: '3px 3px 2px black'}} type='submit'>Create Event </button>
                </form>

            </div>
        </>
    )
}

export default CreateEventForm
