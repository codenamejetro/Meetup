import { useDispatch, useSelector } from "react-redux"
import { deleteGroupThunk } from "../../store/groups"
import { useModal } from "../../context/Modal"
import { useHistory } from "react-router-dom"


function ConfirmDeleteGroup () {
    const history = useHistory()
    const { closeModal } = useModal()
    const dispatch = useDispatch()



    const theGroupId = useSelector(state => state.groups.singleGroup.id)
    // console.log("the Group Id ", theGroupId)
    const deleteClick = (e) => {
        dispatch(deleteGroupThunk(theGroupId))
        history.push('/groups-display')
        closeModal()
    }

    const keepClick = (e) => {
        closeModal()
    }



    return (
        <div>
            <div className="confirm-title">Confirm Delete</div>
            <div className="confirm-question">Are you sure you want to remove this group</div>
            <div className="confirm-delete confirm-buttons" onClick={deleteClick}>{`Yes (delete group)`}</div>
            <div className="confirm-keep confirm-buttons" onClick={keepClick}>{`No (keep group)`}</div>
        </div>

    )
}

export default ConfirmDeleteGroup
