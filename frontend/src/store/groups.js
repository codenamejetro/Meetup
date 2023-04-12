import { csrfFetch } from "./csrf";

const GET_GROUPS = 'groups/fetchGroupsThunk'
const GET_GROUP = 'groups/fetchOneGroupThunk'
const CREATE_GROUP = 'groups/createGroupThunk'
const UPDATE_GROUP = 'groups/updateGroupThunk'
const DELETE_GROUP = 'groups/deleteGroupThunk'

//Action creators
const fetchGroups = (groups) => {
    return {
        type: GET_GROUPS,
        groups: groups
    }
}

const fetchGroup = (group) => {
    return {
        type: GET_GROUP,
        group: group
    }
}

const createGroup = (group) => {
    return {
        type: CREATE_GROUP,
        group: group
    }
}

const updateGroup = (group) => {
    return {
        type: UPDATE_GROUP,
        group: group
    }
}

const deleteGroup = (group) => {
    return {
        type: DELETE_GROUP,
        group: group
    }
}

//Thunk action creators
export const fetchGroupsThunk = () => async (dispatch) => {
    const response = await fetch('/api/groups')
    if (response.ok) {
        const data = await response.json()
        dispatch(fetchGroups(data))

    } else return null
}
export const fetchOneGroupThunk = (groupId) => async (dispatch) => {
    const response = await fetch(`/api/groups/${groupId}`)
    if (response.ok) {
        const data = await response.json()
        dispatch(fetchGroup(data))
    } else return null
}
export const createGroupThunk = (group) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(group)
    })
    console.log('right after fetch')
    if (response.ok) {
        const data = await response.json()
        dispatch(createGroup(data))
    } else return null
}
export const updateGroupThunk = (groupId) => async (dispatch) => {
    const response = await fetch(`/api/groups/${groupId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(response)
    })

}
export const deleteGroupThunk = (groupId) => async (dispatch) => {
    const response = await fetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(groupId)
    })
}

//Reducer
const initialState = { allGroups: {}, singleGroup: {}}
const groupsReducer = (state = initialState, action) => {
    let newState
    const theGroup = action.group
    switch (action.type) {
        case GET_GROUPS:
            newState = { ...state , allGroups: {} }
            // console.log("newState", newState)
            action.groups.Groups.forEach(group => newState.allGroups[group.id] = group)
            return newState
        case GET_GROUP:
            // const theGroup = action.group
            // console.log("theGroup ", theGroup)
            newState = { ...state , singleGroup: {...theGroup} }
            return newState
        case CREATE_GROUP:
            // const theGroup = action.group
            // console.log("this is action.group ", action.group)
            newState = { ...state, singleGroup: {...theGroup}}
            // newState = { ...state , allGroups: {} }
            // const newArr = [action.group]
            // newArr.forEach(group => newState.allGroups[group.id] = group)
            return newState
        return ''
        case UPDATE_GROUP:

        return ''
        case DELETE_GROUP:

        return ''
        default:
            return state
    }
}

export default groupsReducer
//newState = { ...state , singleGroup: {...theGroup} }
