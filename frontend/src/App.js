import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormModal from "./components/SignupFormModal";
import Base from "./components/DisplayGroupsOrEvents/Base";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SplashPage from "./components/SplashPage";
import GroupShow from "./components/DisplayGroupsOrEvents/GroupShow";
import EventShow from "./components/DisplayGroupsOrEvents/EventShow";
import CreateGroupForm from "./components/CreateGroupForm";
import UpdateGroupForm from "./components/UpdateGroupForm";
import DisplayGroups from "./components/DisplayGroupsOrEvents/DisplayGroups";
import DisplayEvents from "./components/DisplayGroupsOrEvents/DisplayEvents";
import CreateEventForm from "./components/CreateEventForm";
//ask about exact path (.) and exact to (navigation/index)

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    // debugger;
    dispatch(sessionActions.restoreUserThunk()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/signup">
            <SignupFormModal />
          </Route>


          <Route exact path='/events-display'>
            <DisplayEvents />
          </Route>
          <Route exact path='/events/:eventId'>
            <EventShow />
          </Route>
          <Route exact path='/groups/:groupId/start-an-event'>
            <CreateEventForm />
          </Route>
          {/* <Route exact path='events/:eventId/edit'>

          </Route> */}


          <Route exact path='/groups-display'>
            <DisplayGroups />
          </Route>
          <Route exact path="/groups/:groupId">
            <GroupShow />
          </Route>
          <Route exact path='/start-a-group'>
            <CreateGroupForm />
          </Route>
          <Route exact path='/groups/:groupId/edit'>
            <UpdateGroupForm />
          </Route>


          <Route exact path='/'>
            <SplashPage />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
