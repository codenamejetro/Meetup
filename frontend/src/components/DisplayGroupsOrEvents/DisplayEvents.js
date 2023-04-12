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

    useEffect(() => {
        dispatch(fetchEventsThunk())
    }, [dispatch])

    const handleClick = () => {
        setUrl('/groups-display')
    }


    if (!eventsInitial) return null


    return (
<>
        <div className='event-base-selection'>
            <div className="at-event-button toggle-between">Events</div>
            <div onClick={handleClick} className="toggle-between">Groups {url && <Redirect to={url}/>}</div>
        </div>
        <section>
            <div className='event-caption'>Events in SeparateDown</div>
            <ul>
                {events.map((event) => (
                    // <NavLink className='style-all-links' to='/groups'>
                    <NavLink className='style-all-links' to={`/events/${event.id}`}>
                    <div className='event-card'>
                        <img src={'img'} />
                        <div className='event-card-info'>
                            <h3>{'date · time'}</h3>
                            <h4>{'description'}</h4>
                            <h5>{'location'}</h5>
                            <div className="event-card-info-bottom" >
                                <p>{'hi'} members ·</p>
                                <p>{'hi' ? `private` : `public`}</p>
                            </div>
                        </div>
                    </div>

                    </NavLink>
                ))}
            </ul>
        </section>
</>

    )
}

export default DisplayEvents
