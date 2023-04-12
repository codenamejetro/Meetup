import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, Redirect } from "react-router-dom";
import { fetchGroupsThunk } from '../../store/groups'
import './DisplayGroups.css'

function DisplayGroups() {
    const dispatch = useDispatch()
    const [url, setUrl] = useState('')
    const groupsInitial = useSelector(state => state.groups.allGroups);
    const groups = Object.values(groupsInitial)

    useEffect(() => {
        dispatch(fetchGroupsThunk())
    }, [dispatch])

    const handleClick = () => {
        setUrl('/events-display')
    }


    if (!groupsInitial) return null


    return (
<>
        <div className='group-base-selection'>
            <div onClick={handleClick} className="event-button toggle-between">Events {url && <Redirect to={url}/>}</div>
            <div className="at-group-button toggle-between">Groups</div>
        </div>
        <section>
            <div className='group-caption'>Groups in SeparateDown</div>
            <ul>
                {groups.map((group) => (
                    <NavLink className='group-card-redirect style-all-links' to={`/groups/${group.id}`}>
                    <div className='group-card'>
                        <img src={group.previewImage} />
                        <div className='group-card-info'>
                            <h3>{group.name}</h3>
                            <h4>{group.city}</h4>
                            <h5>{group.about}</h5>
                            <div className="group-card-info-bottom" >
                                <p>{group.numMembers} members ·</p>
                                <p>{group.private ? `private` : `public`}</p>
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

export default DisplayGroups
