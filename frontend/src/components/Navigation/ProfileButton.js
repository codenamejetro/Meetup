import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { NavLink, Redirect } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [url, setUrl] = useState('')
  const ulRef = useRef();

  const openMenu = (e) => {
    // e.nativeEvent.stopImmediatePropagation()
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      // e.nativeEvent.stopImmediatePropagation()
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  // const sendToGroups = (e) => {
  //   e.nativeEvent.stopImmediatePropagation()
  //   setUrl('/group-event-display')
  //   closeMenu()
  // }

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation()
    dispatch(sessionActions.logoutUserThunk());
    // e.stopPropagation()
    closeMenu();
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <div className='profile-button' onClick={(e) => openMenu(e)}>
        <i className="fas fa-user-circle fa-2xl" />
        {showMenu ? <i class="fa-solid fa-angle-up fa-xl"></i> : <i class="fas fa-angle-down fa-xl"></i>}
      </div>

      <ul className={ulClassName} ref={ulRef}>
        {user && showMenu && (
          <div className='profile-button-logged-in' >

            <li>Hello {user.firstName}</li>
            <div className='for-styling'></div>
            <li>{user.email}</li>
            <div className='for-styling'></div>
            <NavLink style={() => ({ color: "black", textDecoration: "none", fontWeight: "bold" })} to='/groups-display'>View groups</NavLink>
            <div className='for-styling'></div>
            <NavLink style={() => ({ color: "black", textDecoration: "none", fontWeight: "bold" })} to='/events-display'>View events</NavLink>
            {/* <div className='for-styling for-styling-add-line'>-------------------</div> */}
            <div className='for-styling for-styling-separation'>
              <div className='profile-button-logout' onClick={(e) => logout(e)} style={{ fontWeight: "bold" }}>Log Out</div>
            </div>
          </div>
        )}



        {/* {!user && ((<div className='profile-button' onClick={(e) => openMenu(e)}>
          <i className="fas fa-user-circle fa-2xl" />
          <i class="fas fa-angle-down fa-xl"></i> */}

        {!user && showMenu && (
          <div className='profile-button-logged-out'>
            <div className="profile-button-logged-out-each for-styling">
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </div>
            <div className="profile-button-logged-out-each for-styling">
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />

            </div>
          </div>
        )}
        {/* </div> */}
        {/* ))} */}
      </ul>
    </>
  );
}

export default ProfileButton;

// <ul className={ulClassName} ref={ulRef}>
//         {user ? (
//           <>
//             <li>{user.username}</li>
//             <li>{user.firstName} {user.lastName}</li>
//             <li>{user.email}</li>
//             <li>
//               <button onClick={logout}>Log Out</button>
//             </li>
//           </>
//         ) : (
//           <>
//             <OpenModalMenuItem
//               itemText="Log In"
//               onItemClick={closeMenu}
//               modalComponent={<LoginFormModal />}
//             />
//             <OpenModalMenuItem
//               itemText="Sign Up"
//               onItemClick={closeMenu}
//               modalComponent={<SignupFormModal />}
//             />
//           </>
//         )}
//       </ul>
