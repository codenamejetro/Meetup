import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { fetchEventsThunk, fetchOneEventThunk } from "../../store/events"
import { useParams, NavLink } from "react-router-dom"
import { fetchGroupsThunk, fetchOneGroupThunk } from "../../store/groups"
import EventShowGroup from "./EventShowGroup"


function EventShow() {
    const dispatch = useDispatch()
    const [url, setUrl] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const { eventId } = useParams()


    const sessionUser = useSelector(state => state.session.user);
    const allEvents = useSelector(state => state.events.allEvents);
    // const group = useSelector(state => state.events.singleEvent.Group)
    const event = allEvents[eventId]

    // console.log("event ", group)
            // dispatch(fetchOneGroupThunk(groupId))

    useEffect(() => {
        dispatch(fetchEventsThunk())
        // dispatch(fetchOneEventThunk(eventId))
        // dispatch(fetchGroupsThunk())
    }, [dispatch])

    // if(!allEvents) return null
    if(!event) return null
    // if(!group) return null

    return (
        <>
            <div className='event-bread-crumb-singular'> {`<`} <NavLink to='/events-display'>Events</NavLink></div>

            <div className='event-title-singular'>
                <p>{event.name} <br /> </p>
              Hosted by {`firstName`} {`lastName`}
            </div>

            <div className='event-three-cards-singular'>
                <img src={event.previewImage}></img>
                <div className="event-two-cards-singular">
                    <NavLink className='event-two-cards-nav' to='/groups'>
                        <EventShowGroup event={event}/>
                    </NavLink>
                    <div className='event-card-container-singular'>
                        <div className='event-card-start-end-time-singular'>
                            Start time {`${event.startDate.split("T")[0]} · ${event.startDate.split("T")[1].slice(0, event.startDate.split("T")[1].length - 2)}` } <br /> <br />
                            End time {`${event.endDate.split("T")[0]} · ${event.endDate.split("T")[1].slice(0, event.endDate.split("T")[1].length - 2)}`}
                        </div>

                        <div className='event-card-price-singular'>{event.price === 0 ? `FREE` : `Price ---> $` + event.price}</div>
                        <div className='event-card-in-person-label-singular'>{event.type === 'In person' ? `In Person` : 'Online'}</div>
                    </div>
                </div>
            </div>


            <div className='event-details-singular'>
                <div className='event-details-title-singular'>
                    Details
                </div>
                <p>the details</p>
            </div>
        </>
    )
}

export default EventShow
