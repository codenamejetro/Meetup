import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchOneGroupThunk } from "../../store/groups";


function GroupShow() {
    const dispatch = useDispatch()
    const { groupId } = useParams()
    const group = useSelector(state => state.groups.singleGroup);

    const anObj = { ...group.GroupImages }[0]


    useEffect(() => {
        dispatch(fetchOneGroupThunk(groupId))
    }, [dispatch])

    if (!group) return null
    if (!anObj) return null

    return (
        <>
            <div className='group-card-singular'>
                <img src={anObj['url']} />
                <div className='group-card-info-singular'>
                    <span>{group.name}</span>
                    <p>{group.city}</p>
                    <p>{group.about}</p>
                    <div className="group-card-info-bottom-singular" >
                        <p>{group.numMembers} events</p>
                        <p>{group.private ? `· private` : `· public`}</p>
                    </div>
                    <p>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</p>
                </div>
            </div>

            <div >
                <h2>Organizer</h2>
                <p>{group.Organizer.firstName}</p>
                <h2>What we're about</h2>
                <p></p>
                <h2>Upcoming Events 'replace with number of events' </h2>
                <div></div>
                <h2>Past Events</h2>
                <div></div>
            </div>
        </>
    )
}

export default GroupShow
