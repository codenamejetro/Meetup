import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchGroupsThunk } from '../../store/groups'

function DisplayGroups () {
    const dispatch = useDispatch()
    const groupsInitial = useSelector(state=>state.groups.entries);
    const groups = Object.values(groupsInitial)
    // console.log("the groups", groups)
    console.log(groups['0'])
    useEffect(() => {
        dispatch(fetchGroupsThunk())
    }, [dispatch])

    if (!groupsInitial) return null

    return (
        <>
        hi

            {groups.map(group => {
                <div>hi {group['name']}</div>
            })}
        </>
    )
}

export default DisplayGroups
