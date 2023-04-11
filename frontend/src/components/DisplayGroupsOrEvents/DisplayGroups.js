import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, Redirect } from "react-router-dom";
import { fetchGroupsThunk } from '../../store/groups'

function DisplayGroups() {
    const dispatch = useDispatch()
    const groupsInitial = useSelector(state => state.groups.allGroups);
    const groups = Object.values(groupsInitial)

    useEffect(() => {
        dispatch(fetchGroupsThunk())
    }, [dispatch])

    if (!groupsInitial) return null

    return (

        <section>
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
                                <p>{group.numMembers} members  </p>
                                <p>{group.private ? `private` : `public`}</p>
                            </div>
                        </div>
                    </div>

                    </NavLink>
                ))}
            </ul>
        </section>

    )
}

export default DisplayGroups
