import React from "react"
import ProfileButton from "../Navigation/ProfileButton"
import { NavLink } from "react-router-dom"
import './TopBar.css'

function TopBar({ sessionUser, isLoaded }) {
    return (
        <>

            <div className='nav-bar'>
                <div className='title-portion'>
                    <NavLink className='style-all-links' exact to="/">
                        SeparateDown?
                    </NavLink>
                </div>



                {isLoaded && (

                    <div className="profile-buttons">
                        {sessionUser && (<NavLink className='profile-buttons-start-group' to ='/start-a-group'>Start a new group</NavLink>)}
                        <ProfileButton user={sessionUser} />
                    </div>
                )}
            </div>
        </>
    )
}
export default TopBar
