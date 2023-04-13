import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, Redirect } from "react-router-dom";
import { fetchEventsThunk } from '../../store/events'
import './DisplayEvents.css'

function DisplayEvents() {
    const dispatch = useDispatch()
    const [url, setUrl] = useState('')
    const eventsInitial = useSelector(state => state.events.allEvents);
    const events = Object.values(eventsInitial)
    // console.log("events ", events)

    useEffect(() => {
        dispatch(fetchEventsThunk())
    }, [dispatch])

    const handleClick = () => {
        setUrl('/groups-display')
    }

    let eventsToCome = []
    let prevEvents = []

    events.forEach(event => {
        if (new Date(event.startDate) > new Date()) {
            eventsToCome.push(event)
        } else prevEvents.push(event)
    })

    eventsToCome.sort((a, b) => {
        const dateA = a.startDate; // ignore upper and lowercase
        const dateB = b.startDate; // ignore upper and lowercase
        if (dateA < dateB) {
            return -1;
        }
        if (dateA > dateB) {
            return 1;
        }

        // names must be equal
        return 0;
    });

    prevEvents.sort((a, b) => {
        const dateA = a.startDate; // ignore upper and lowercase
        const dateB = b.startDate; // ignore upper and lowercase
        if (dateA < dateB) {
            return 1;
        }
        if (dateA > dateB) {
            return -1;
        }

        // names must be equal
        return 0;
    });


    if (!eventsInitial) return null


    return (
        <>
            <div className='event-base-selection'>
                <div className="at-event-button toggle-between">Events</div>
                <div onClick={handleClick} className="toggle-between">Groups {url && <Redirect to={url} />}</div>
            </div>
            <section>
                <div className='event-caption'>Events in SeparateDown</div>
                <ul>
                    {eventsToCome.map((event) => (
                        // <NavLink className='style-all-links' to='/groups'>
                        <NavLink className='style-all-links' to={`/events/${event.id}`}>
                            <div className="event-entire-card">
                                <div className='event-card'>
                                    <img src={event.previewImage} />
                                    <div className='event-card-info'>
                                        <h3>{`${event.startDate.split("T")[0]} · ${event.startDate.split("T")[1].slice(0, event.startDate.split("T")[1].length - 1)}`}</h3>
                                        <h4>{`${event.description}`}</h4>
                                        <h5>{`${event.Venue.city}, ${event.Venue.state}`}</h5>
                                        {/* <div className="event-card-info-bottom" >
                                <p>{'hi'} members ·</p>
                                <p>{'hi' ? `private` : `public`}</p>
                            </div> */}
                                    </div>
                                </div>
                                <div>desc</div>

                            </div>

                        </NavLink>
                    ))}
                </ul>

                <div className="event-prev-events"> Previous Events
                    {prevEvents.map((event) => (
                        <div className="event-entire-card">
                            <div className='event-card'>
                                <img src={event.previewImage} />
                                <div className='event-card-info'>
                                    <h3>{`${event.startDate.split("T")[0]} · ${event.startDate.split("T")[1].slice(0, event.startDate.split("T")[1].length - 1)}`}</h3>
                                    <h4>{`${event.description}`}</h4>
                                    <h5>{`${event.Venue.city}, ${event.Venue.state}`}</h5>
                                </div>
                            </div>
                            <div>desc</div>

                        </div>
                    ))}
                </div>
            </section>
        </>

    )
}

export default DisplayEvents
