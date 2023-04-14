import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { fetchEventsThunk, fetchOneEventThunk } from "../../store/events"
import { useParams, NavLink } from "react-router-dom"
import EventShowGroup from "./EventShowGroup"
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem"
import ConfirmDeleteEvent from "../HelperComps/ConfirmDeleteEvent"


function EventShow() {
    const dispatch = useDispatch()
    const [url, setUrl] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const { eventId } = useParams()


    const sessionUser = useSelector(state => state.session.user);
    const allEvents = useSelector(state => state.events.allEvents);

    const event = allEvents[eventId]


    useEffect(() => {
        dispatch(fetchEventsThunk())
        dispatch(fetchOneEventThunk(eventId))
    }, [dispatch])

    if (!event) return null

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
                        <EventShowGroup event={event} />
                    </NavLink>
                    <div className='event-card-container-singular'>
                        <div className='event-card-start-end-time-singular'>
                            Start time {`${event.startDate.split("T")[0]} · ${event.startDate.split("T")[1].slice(0, event.startDate.split("T")[1].length - 2)}`} <br /> <br />
                            End time {`${event.endDate.split("T")[0]} · ${event.endDate.split("T")[1].slice(0, event.endDate.split("T")[1].length - 2)}`}
                        </div>

                        <div className='event-card-price-singular'>{event.price === 0 ? `FREE` : `Price ---> $` + event.price}</div>

                        <div>
                            <div className='event-card-in-person-label-singular'>{event.type === 'In person' ? `In Person` : 'Online'}</div>
                            <div>
                            {/* <button onClick={(e) => handleClick(e)}>Update {url && <Redirect to={url} currId={Number(groupId)} />} </button> */}
                                <OpenModalMenuItem
                                itemText="Delete"
                                modalComponent={<ConfirmDeleteEvent />}/>
                            </div>
                        </div>

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
