import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchEventsThunk } from "../../store/events";
import { NavLink } from "react-router-dom";



function GroupShowEvents({groupId}) {
    const dispatch = useDispatch()
    console.log(groupId)

    const eventsInitial = useSelector(state => state.events.allEvents);
    const events = Object.values(eventsInitial)

    console.log("events: ", events)
    const eventsForGroup = events.filter(event => event.groupId === +groupId)
    let eventsToCome = []
    let prevEvents = []
    console.log("eventsForGroup: ", eventsForGroup)

    eventsForGroup.forEach(event => {
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



    useEffect(() => {
        dispatch(fetchEventsThunk())
    }, [dispatch])


    if (!eventsInitial) return null

    return (
        <>
            <h2>Upcoming Events {`(${eventsToCome.length})`} </h2>

            {eventsToCome.length > 0 ?(<div>{eventsToCome.map((event) => (
                        // <NavLink className='style-all-links' to='/groups'>
                        <NavLink className='style-all-links' to={`/events/${event.id}`}>
                            <div className="event-entire-card">
                                <div className='event-card'>
                                    <img src={event.previewImage} />
                                    <div className='event-card-info'>
                                        <h3>{`${event.startDate.split("T")[0]} · ${event.startDate.split("T")[1].slice(0, event.startDate.split("T")[1].length - 8)}`}</h3>
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
            </div>)
             : (<div>No Upcoming Events</div>) }
            <h2>Past Events {`(${prevEvents.length})`}</h2>
            <div className="event-prev-events">
                    {prevEvents.map((event) => (
                        <div className="event-entire-card">
                            <div className='event-card'>
                                <img src={event.previewImage} />
                                <div className='event-card-info'>
                                    <h3>{`${event.startDate.split("T")[0]} · ${event.startDate.split("T")[1].slice(0, event.startDate.split("T")[1].length - 8)}`}</h3>
                                    <h4>{`${event.description}`}</h4>
                                    <h5>{`${event.Venue.city}, ${event.Venue.state}`}</h5>
                                </div>
                            </div>
                            <div>desc</div>

                        </div>
                    ))}
                </div>
        </>

    )
}

export default GroupShowEvents
