import React from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from '../Navigation/ProfileButton';
import TopBar from '../HelperComps/TopBar';
import './SplashPage.css';
import SplashOptionsDisplay from '../HelperComps/SplashOptionsDisplay';
import SignupFormModal from '../SignupFormModal';

function SplashPage() {
  const sessionUser = useSelector(state => state.session.user);

const handleSignupClick = () => {
  return <SignupFormModal />
}

  return (
    <>
      <div className='splash-large-description'>
        <div className='splash-large-description-text'>
          <h2>
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
          <SplashOptionsDisplay imgUrl={''} text={'See all groups'} smallerText={`Meet groups of people that don't want to be near each other`} redirectUrl={'/group-event-display'}/>
        </div>
        <div>
          <SplashOptionsDisplay imgUrl={''} text={'Find an event'} smallerText={`Come to our really awkward events`} redirectUrl={'/group-event-display'}/>
        </div>
        <div>
          <SplashOptionsDisplay imgUrl={''} text={'Start a new group'} smallerText={`Feel superior as the head of a group comprised of those that don't want to be near each other`} redirectUrl={''} display={sessionUser ? true : false}/>
        </div>
      </div>


      {!sessionUser && (<div className='splash-join-button' onClick={() => handleSignupClick()}>
        <button>Join us</button>
      </div>)}
    </>
  );
}

export default SplashPage;
