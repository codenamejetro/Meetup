import { useState } from "react"
import { Redirect, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { deleteGroupThunk } from "../../store/groups"
import { useModal } from "../../context/Modal"


function ConfirmDeleteGroup () {
    // const { groupId } = useParams()
    const { closeModal } = useModal()
    const dispatch = useDispatch()
    const [url, setUrl] = useState('')



    const theGroupId = useSelector(state => state.groups.singleGroup.id)
    console.log("the Group Id ", theGroupId)
    const deleteClick = (e) => {
        dispatch(deleteGroupThunk(theGroupId))
        setUrl(`/groups-display`)
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
            {url && <Redirect to={url}/>}
        </div>

    )
}

export default ConfirmDeleteGroup
