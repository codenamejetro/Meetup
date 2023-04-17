import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { fetchEventsThunk, fetchOneEventThunk } from "../../store/events"
import { useParams, NavLink } from "react-router-dom"
import EventShowGroup, { EventShowHost } from "./EventShowGroup"
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem"
import ConfirmDeleteEvent from "../HelperComps/ConfirmDeleteEvent"
import { fetchGroupsThunk, fetchOneGroupThunk } from "../../store/groups"


function EventShow() {
    const dispatch = useDispatch()
    const [url, setUrl] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const { eventId } = useParams()


    const sessionUser = useSelector(state => state.session.user);
    const allEvents = useSelector(state => state.events.allEvents);
    // console.log(sessionUser)
    const event = allEvents[eventId]
    console.log("tyughyiy", event)

    useEffect(() => {
        dispatch(fetchEventsThunk())
        dispatch(fetchOneEventThunk(eventId))
    }, [dispatch])

    if (!event) return null

    return (
        <>
            <div className="event-wrapper-singular">
                {/* <div className="event-wrapper-section"> */}
                <div className="event-top-singular">

                    <div className='event-title-singular'>
                        <div className='event-bread-crumb-singular'> {`<`} <NavLink to='/events-display'>Events</NavLink></div>
                        <h2>{event.name}</h2>
                        <EventShowHost eventGroup={event} />
                    </div>

                    <div className="event-wrapper-singular-three">
                        <div className="event-wrapper-singular-two">
                            <div className="event-card-down-singular">
                                <div className='event-three-cards-singular'>
                                    <img src={event.previewImage}></img>
                                    <div className="event-two-cards-singular">
                                        <NavLink className='event-two-cards-nav' to='/groups'>
                                            <EventShowGroup event={event} />
                                        </NavLink>
                                        <div className='event-card-container-singular'>
                                            <div className="event-card-start-end-time-wrapper-singular">
                                                <i class="fa-regular fa-clock fa-2xl"></i>
                                                <div className='event-card-start-end-time-singular'>
                                                    Start time {`${event.startDate.split("T")[0]} · ${event.startDate.split("T")[1].slice(0, event.startDate.split("T")[1].length - 2)}`} <br /> <br />
                                                    End time {`${event.endDate.split("T")[0]} · ${event.endDate.split("T")[1].slice(0, event.endDate.split("T")[1].length - 2)}`}
                                                </div>
                                            </div>

                                            <div className="event-card-container-price-singular">
                                                <i class="fa-solid fa-dollar-sign fa-2xl"></i>
                                                <div className='event-card-price-singular'>{event.price === 0 ? ` FREE` : `Price ---> $` + event.price}</div>
                                            </div>

                                            <div className="event-card-container-bottom-wrapper-singular">
                                                <div className="event-card-container-bottom-online-singular">
                                                    <i class="fa-solid fa-person fa-2xl"></i>
                                                    <div className='event-card-in-person-label-singular'>{event.type === 'In person' ? `In Person` : 'Online'}</div>

                                                </div>
                                                {/* {sessionUser && CheckIfEventHost({event}, sessionUser) && <div> */}
                                                {/* <div> */}
                                                {/* <button onClick={(e) => handleClick(e)}>Update {url && <Redirect to={url} currId={Number(groupId)} />} </button> */}
                                                <div>

                                                    <ul className="event-card-container-bottom-singular">
                                                        <OpenModalMenuItem
                                                            itemText="Delete"
                                                            modalComponent={<ConfirmDeleteEvent />} />
                                                        {/* </div> */}
                                                    </ul>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </div>


                                <div className='event-details-singular'>
                                    <div className='event-details-title-singular'>
                                        Details
                                    </div>
                                    <p>{`${event.description}`}</p>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}


// function CheckIfEventHost( {event}, sessionUser ) {
//     const [loading, setLoading] = useState(true);
//     const dispatch = useDispatch()

//     console.log(event)
//     const groupId = event.groupId
//     const group = useSelector(state => state.groups.allGroups)
//     const theGroup = group[groupId]
//     const theOrg = theGroup.Organizer
//     console.log('1', theGroup)
//     // const org = group.Organizer
//     // console.log('2', org)
//     // const id = org.id
//     // console.log('3', id)
// useEffect(() => {
//     if (loading) {
//         setLoading(false)
//         dispatch(fetchGroupsThunk())
//     }
// }, [loading])


//     if (!group) return null

//     if (!theOrg) return null
//     // if (!id) return null
//     return sessionUser.id === theOrg.id ? true : false
//     // return id && console.log("hi")
//     // return ''

// }

export default EventShow
