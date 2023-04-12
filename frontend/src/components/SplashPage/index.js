import React from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from '../Navigation/ProfileButton';
import TopBar from '../HelperComps/TopBar';
import './SplashPage.css';
import SplashOptionsDisplay from '../HelperComps/SplashOptionsDisplay';
import SignupFormModal from '../SignupFormModal';
import OpenModalButton from "../OpenModalButton";

function SplashPage() {
  const sessionUser = useSelector(state => state.session.user);

  const handleClick = (e) => {
    if (!sessionUser) {

      e.preventDefault()
      return (
        <Redirect to='/signup'></Redirect>

      )

    //add modal or alert
  }
  }

return (
  <>
    <div className='splash-large-description'>
      <div className='splash-large-description-text'>
        <h2 className='splash-title'>
          The answer to your problems!
        </h2>
        <h4>
          Let's be honest. You don't want to go outside, but
          you need the social interaction to stop from going
          crazy, so join us in our pursuit to try to be humans
        </h4>
      </div>
      <div className='splash-large-description-img'>
        <h2>replace with img</h2>
        {/* <img/> */}
      </div>
    </div>

    <div className='splash-description'>
      <h3>So how does it all work?</h3>
      <p>Meet with other socially deprived people that need an excuse to go outside!</p>
    </div>

    <div className='splash-three-components'>
      <div>
        <SplashOptionsDisplay imgUrl={''} text={'See all groups'} smallerText={`Meet groups of people that don't want to be near each other`} redirectUrl={'/group-event-display'} />
      </div>
      <div>
        <SplashOptionsDisplay imgUrl={''} text={'Find an event'} smallerText={`Come to our really awkward events`} redirectUrl={'/group-event-display'} />
      </div>
      <div>
        {/* <SplashOptionsDisplay imgUrl={''} text={'Start a new group'} smallerText={`Feel superior as the head of a group comprised of those that don't want to be near each other`} redirectUrl={'start-a-group'} display={sessionUser ? true : false} /> */}
        <div className="splash-options-display-image style-all-three">
          <img src={`${``}`} />
        </div>
        <NavLink onClick={(e) => handleClick(e)} className="splash-options-display-text style-all-three style-all-links" to={`${'start-a-group'}`}>{'Start a new group'}</NavLink>
        <div className="splash-options-display-smaller-text style-all-three">
          {`Feel superior as the head of a group comprised of those that don't want to be near each other`}
        </div>
      </div>
    </div>


    {!sessionUser && (<div className='splash-join-button'> <OpenModalButton
      buttonText="Join us"
      modalComponent={<SignupFormModal />}
    /> </div>)
    }

  </>
);
}

export default SplashPage;
//className='splash-join-button'
