import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { Redirect } from "react-router-dom";

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

  const closeMenu = () => setShowMenu(false);

  // const sendToGroups = (e) => {
  //   e.nativeEvent.stopImmediatePropagation()
  //   setUrl('/group-event-display')
  //   closeMenu()
  // }

  const logout = (e) => {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation()
    dispatch(sessionActions.logoutUserThunk());
    // e.stopPropagation()
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
    {user && (<button className='profile-button' onClick={(e) => openMenu(e)}>
        <i className="fas fa-user-circle" />
      </button>)}
      {/* <button className='profile-button' onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button> */}
      <ul className={ulClassName} ref={ulRef}>
        {user && showMenu && (
          <div className='profile-button-logged-in' >
            <li>Hello {user.firstName}</li>
            <li>{user.username}</li>
            <li>{user.firstName} {user.lastName}</li>
            <li>{user.email}</li>
            {/* <li>
              <button onClick={(e) => sendToGroups(e)}>View Groups {url && <Redirect to={url} />} </button>
              </li> */}
            <li>
              <button onClick={(e) => logout(e)}>Log Out</button>
            </li>
          </div>
        )}
        {!user && (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
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
