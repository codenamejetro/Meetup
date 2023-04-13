import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { NavLink, Redirect, useParams } from "react-router-dom";
import { fetchGroupsThunk, fetchOneGroupThunk } from "../../store/groups";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import ConfirmDeleteGroup from "../HelperComps/ConfirmDeleteGroup";

function GroupShow() {
    const dispatch = useDispatch()
    const [url, setUrl] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const { groupId } = useParams()
    const sessionUser = useSelector(state => state.session.user);
    const allGroups = useSelector(state => state.groups.allGroups);
    const group = allGroups[groupId]

    const singleGroup = useSelector(state => state.groups.singleGroup)
    const singleGroupImage = useSelector(state => state.groups.singleGroup.GroupImages)

    useEffect(() => {
        dispatch(fetchGroupsThunk())
        dispatch(fetchOneGroupThunk(groupId))
    }, [dispatch])

    const handleClick = (e) => {
        // e.preventDefault()
        setUrl(`/groups/${groupId}/edit`)
    }

    const handleJoin = (e) => {
        e.preventDefault()
        return alert('Feature coming soon')
    }


    if (!group) return null
    // if (!anObj) return null
    if (!singleGroup) return null
    if (!singleGroupImage) return null



    return (
        <>
            <div className='bread-crumb'> {`<`} <NavLink to='/groups-display'>Groups</NavLink></div>
            {/* {openModal && (<div><OpenModalMenuItem /></div>)} */}
            <div className='group-card-singular'>
                {singleGroupImage.length > 0 ? (<img src={singleGroup.GroupImages[0].url} />) : <img />}
                <div className='group-card-info-singular'>
                    <span>{group.name}</span>
                    <p>{group.city}</p>
                    <p>{group.about}</p>
                    <div className="group-card-info-bottom-singular" >
                        <p>{group.numMembers} events</p>
                        <p>{group.private ? `· private` : `· public`}</p>
                    </div>
                    <p>Organized by {singleGroup.Organizer.firstName} {singleGroup.Organizer.lastName}</p>
                    {sessionUser && sessionUser.id === singleGroup.Organizer.id && (
                        <div>
                            <NavLink to={`/groups/${groupId}/start-an-event`}>Create event</NavLink>
                            <button onClick={(e) => handleClick(e)}>Update {url && <Redirect to={url} currId={Number(groupId)} />} </button>
                            <OpenModalMenuItem
                                itemText="Delete"
                                // onItemClick={closeMenu}
                                modalComponent={<ConfirmDeleteGroup />} />
                        </div>
                    )}
                    {sessionUser && sessionUser.id !== singleGroup.Organizer.id && <button onClick={handleJoin} className="group-card-singular-join">Join this group</button>}

                </div>

            </div>

            <div >
                <h2>Organizer</h2>
                <p>{singleGroup.Organizer.firstName}</p>
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


// const dispatch = useDispatch()
//     const { groupId } = useParams()
//     const sessionUser = useSelector(state => state.session.user);
//     // console.log("session user id ",  sessionUser)
//     const group = useSelector(state => state.groups.singleGroup);

//     const anObj = { ...group.GroupImages }[0]


//     useEffect(() => {
//         dispatch(fetchOneGroupThunk(groupId))
//     }, [dispatch])

//     if (!group) return null
//     if (!anObj) return null
