import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { createEventThunk } from "../../store/events"
import { useParams, Redirect } from "react-router-dom"

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
        if (description.length < 31) errors.description ='Description must be at least 30 characters long'
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
            <div>
                Create an event for group name
            </div>
            <form onSubmit={onSubmit}>
                <label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={'Event Name'}
                    />
                    {displayErr === true && err.name && (<p className="errors">· {err.name}</p>)}
                </label>

                <label>
                    Is this an in person or online event?
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
                </label>

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
                    {displayErr === true && err.isPrivate && (<p className="errors">· {err.isPrivate}</p>)}
                </label>

                <label>
                    What is the price for your event?
                    <input
                        type="text"
                        // inputmode="numeric"
                        name="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder={'0'}
                    />
                    {displayErr === true && err.price && (<p className="errors">· {err.price}</p>)}
                </label>

                <label>
                    When does your event start?
                    <input
                        type="datetime-local"
                        name="eventStart"
                        value={eventStart}
                        onChange={(e) => setEventStart(e.target.value)}
                        placeholder={'MM/DD/YYYY HH:mm AM'}
                    />
                    {displayErr === true && err.eventStart && (<p className="errors">· {err.eventStart}</p>)}
                </label>
                <label>
                    When does your event end?
                    <input
                        type="datetime-local"
                        name="eventEnd"
                        value={eventEnd}
                        onChange={(e) => setEventEnd(e.target.value)}
                        placeholder={'MM/DD/YYYY HH:mm PM'}
                    />
                    {displayErr === true && err.eventEnd && (<p className="errors">· {err.eventEnd}</p>)}
                </label>

                <label>
                    Please add an image url for your group below:
                    <input
                        type="text"
                        name="img"
                        value={img}
                        onChange={(e) => setImg(e.target.value)}
                        placeholder={'Image URL'}
                    />
                    {displayErr === true && err.img && (<p className="errors">· {err.img}</p>)}
                </label>


                <label htmlFor='description'>
                Please describe your event:
                    <textarea id='description' name='description' rows={'5'} cols={'50'} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={'Please include at least 30 characters'}></textarea>
                    {displayErr === true && err.description && (<p className="errors">· {err.description}</p>)}
                </label>

                <button type='submit'>Create Event </button>
            </form>
        </>
    )
}

export default CreateEventForm
