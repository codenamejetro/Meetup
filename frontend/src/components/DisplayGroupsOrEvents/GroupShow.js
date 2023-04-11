import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchOneGroupThunk } from "../../store/groups";


function GroupShow() {
    const dispatch = useDispatch()
    const { groupId } = useParams()
    const group = useSelector(state => state.groups.singleGroup);

    const anObj = {...group.GroupImages}[0]


    useEffect(() => {
        dispatch(fetchOneGroupThunk(groupId))
    }, [dispatch])

    if (!group) return null
    if (!anObj) return null

    return (<div className='group-card-singular'>
    <img src={anObj['url']} />
    <div className='group-card-info-singular'>
        <h3>{group.name}</h3>
        <h4>{group.city}</h4>
        <h5>{group.about}</h5>
        <div className="group-card-info-bottom-singular" >
            <p>{group.numMembers} members  </p>
            <p>{group.private ? `private` : `public`}</p>
        </div>
    </div>
</div>)
}

export default GroupShow
