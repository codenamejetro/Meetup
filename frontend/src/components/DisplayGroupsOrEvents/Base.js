import DisplayEvents from "./DisplayEvents"
import DisplayGroups from "./DisplayGroups"
import { useState } from "react"
import './Base.css'

function Base () {
    const [displayEvents, setDisplayEvents] = useState(true)

    const handleClick = () => {
        // displayEvents ? setDisplayEvents(false) : setDisplayEvents(true)
        setDisplayEvents(!displayEvents)
    }

    return (
        <>
        <div className='base-selection'>
            <div onClick={() => !displayEvents && handleClick()} className="event-button toggle-between">Events</div>
            <div onClick={() => displayEvents && handleClick()} className="group-button toggle-between">Groups</div>
        </div>
        {displayEvents ? <DisplayEvents /> : <DisplayGroups />}
        </>
    )
}

export default Base
