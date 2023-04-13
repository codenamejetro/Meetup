import { csrfFetch } from "./csrf";

const GET_EVENTS = 'events/fetchEventThunk'
const GET_EVENT = 'events/fetchOneEventThunk'
const CREATE_EVENT = 'events/createEventThunk'
const UPDATE_EVENT = 'events/updateEventThunk'
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

const updateEvent = (event) => {
    return {
        type: UPDATE_EVENT,
        event
    }
}

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
export const createEventThunk = (group) => async (dispatch) => {

}
// export const updateEventThunk = (group, groupId) => async (dispatch) => {

// }
export const deleteEventThunk = (eventId) => async (dispatch) => {

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
            return ''
        // case UPDATE_EVENT:
        //     return ''
        case DELETE_EVENT:
            return ''
        default:
            return state
    }
}

export default eventsReducer
