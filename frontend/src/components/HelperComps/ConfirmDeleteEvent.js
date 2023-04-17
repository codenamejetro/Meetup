import { useDispatch, useSelector } from "react-redux"
import { deleteEventThunk } from "../../store/events"
import { useModal } from "../../context/Modal"
import { useHistory } from "react-router-dom"


function ConfirmDeleteEvent () {
    const history = useHistory()
    const { closeModal } = useModal()
    const dispatch = useDispatch()



    const theEventId = useSelector(state => state.events.singleEvent.id)
    console.log("the Event Id ", theEventId)
    const deleteClick = (e) => {
        dispatch(deleteEventThunk(theEventId))
        history.push('/events-display')
        closeModal()
    }

    const keepClick = (e) => {
        closeModal()
    }



    return (
        <div>
            <div className="confirm-title">Confirm Delete</div>
            <div className="confirm-question">Are you sure you want to remove this event</div>
            <div className="confirm-delete confirm-buttons" onClick={deleteClick}>{`Yes (delete event)`}</div>
            <div className="confirm-keep confirm-buttons" onClick={keepClick}>{`No (keep event)`}</div>
        </div>

    )
}

export default ConfirmDeleteEvent
