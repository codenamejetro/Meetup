import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchOneGroupThunk } from "../../store/groups"

function EventShowGroup({ event }) {
    const dispatch = useDispatch()

    const group = useSelector(state => state.groups.singleGroup)
    const imgUrl = useSelector(state => state.groups.singleGroup.GroupImages)
    console.log("orgId", group)


    useEffect(() => {

        dispatch(fetchOneGroupThunk(event.id))
    }, [dispatch])


    if (!group) return null
    if (!imgUrl) return null
    return (
        <div className='event-redirect-group-card-singular'>
            {imgUrl.length > 0 ? (<img src={group.GroupImages[0].url} />) : <img />}
            <div className ='event-redirect-group-text-singular'>
                <p className="event-redirect-group-text-name-singular">{group.name}</p>
                <p className="event-redirect-group-text-private-singular">{group.private ? 'Private' : 'Public'}</p>
            </div>
        </div>
    )
}

export default EventShowGroup
