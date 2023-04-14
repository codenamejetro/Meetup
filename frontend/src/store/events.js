import { csrfFetch } from "./csrf";

const GET_EVENTS = 'events/fetchEventThunk'
const GET_EVENT = 'events/fetchOneEventThunk'
const CREATE_EVENT = 'events/createEventThunk'
// const UPDATE_EVENT = 'events/updateEventThunk'
const DELETE_EVENT = 'events/deleteEventThunk'

const fetchEvents = (events) => {
    return {
        type: GET_EVENTS,
        events
    }
}

const fetchEvent = (event) => {
    return {
        type: GET_EVENT,
        event
    }
}

const createEvent = (event) => {
    return {
        type: CREATE_EVENT,
        event
    }
}

// const updateEvent = (event) => {
//     return {
//         type: UPDATE_EVENT,
//         event
//     }
// }

const deleteEvent = (eventId) => {
    return {
        type: DELETE_EVENT,
        eventId
    }
}

export const fetchEventsThunk = () => async (dispatch) => {
    const response = await fetch('/api/events')

    if (response.ok) {
    const data = await response.json()
    dispatch(fetchEvents(data))
} else return null
}
export const fetchOneEventThunk = (eventId) => async (dispatch) => {
    const response = await fetch(`/api/events/${eventId}`)
    if (response.ok) {
        const data = await response.json()
        dispatch(fetchEvent(data))
    } else return null
}
export const createEventThunk = (event, groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    })
    if (response.ok) {
        const data = await response.json()
        dispatch(createEvent(data))
        return data
    }
}
// export const updateEventThunk = (group, groupId) => async (dispatch) => {

// }
export const deleteEventThunk = (eventId) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
        // body: JSON.stringify(groupId)
    })
    if (response.ok) {
        // console.log('inside delete thunk')
        const data = await response.json()
        dispatch(deleteEvent(eventId))
    } else return null
}


const initialState = { allEvents: {}, singleEvent: {} }
const eventsReducer = (state = initialState, action) => {
    let newState
    const theEvent = action.event
    switch (action.type) {
        case GET_EVENTS:
            newState = { ...state, allEvents: {} }
            action.events.Events.forEach(event => newState.allEvents[event.id] = event)

            return newState
        case GET_EVENT:
            newState = {...state, singleEvent: { ...theEvent}}
            return newState
        case CREATE_EVENT:
            // console.log("this is theEvent", theEvent)
            newState = { ...state, singleEvent: {...theEvent} }
            return newState
        // case UPDATE_EVENT:
        //     return ''
        case DELETE_EVENT:
            newState = { ...state, allEvents: {} }
            delete newState[action.allEvents[action.eventId]]
            return newState
        default:
            return state
    }
}

export default eventsReducer
