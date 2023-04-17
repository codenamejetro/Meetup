import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchGroupsThunk, fetchOneGroupThunk } from "../../store/groups"

// function CheckIfEventHost({ event, sessionUser }) {
//     const dispatch = useDispatch()

//     const group = useSelector(state => state.groups.singleGroup)
//     console.log("group ", group)

//     useEffect(() => {

//         dispatch(fetchOneGroupThunk(event.groupId))
//     }, [dispatch])

//     if (!group) return null
//     return (
//         sessionUser.id === group.Organizer.id ? true : false
//     )
// }

export function EventShowHost({ event }) {
    const dispatch = useDispatch()

    // console.log("this is event", event)
    // const organizer = useSelector(state => state)
    const organizer = useSelector(state => state.groups.singleGroup.Organizer)
    // console.log(organizer)
    // console.log(group)

    useEffect(() => {
        dispatch(fetchGroupsThunk())
    }, [dispatch])

    if (!organizer) return null

    return (
        <p>Hosted by {`${organizer.firstName}`} {`${organizer.lastName}`}</p>
    )
}



function EventShowGroup({ event }) {
    const dispatch = useDispatch()

    const group = useSelector(state => state.groups.singleGroup)
    const imgUrl = useSelector(state => state.groups.singleGroup.GroupImages)
    // console.log("orgId", group)


    useEffect(() => {

        dispatch(fetchOneGroupThunk(event.groupId))
    }, [dispatch])


    if (!group) return null
    if (!imgUrl) return null

    return (
        <div className='event-redirect-group-card-singular'>
            {imgUrl.length > 0 ? (<img src={group.GroupImages[0].url} />) : <img />}
            <div className='event-redirect-group-text-singular'>
                <p className="event-redirect-group-text-name-singular">{group.name}</p>
                <p className="event-redirect-group-text-private-singular">{group.private ? 'Private' : 'Public'}</p>
            </div>
        </div>
    )
}

export default EventShowGroup
