import DisplayEvents from "./DisplayEvents"
import DisplayGroups from "./DisplayGroups"
import React, { createContext, useState, useContext } from "react"
// import { useContext } from "react"
import './Base.css'

// const displayEventsContext = React.createContext()
// const useDisplayEventsContext = useContext()

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
