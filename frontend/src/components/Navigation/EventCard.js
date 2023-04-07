import React from 'react';
import './EventCard.css';

function EventCard({ startTime, endTime,price,isInPerson }){

  return (
    <div className='card-container'>
        <div className='card-start-time'>Start time: {startTime}</div>
        <div className='card-end-time'>End time: {endTime}</div>
        <div className='card-in-person-label'>{isInPerson ? 'icon for in person' : 'not in person'}</div>
    </div>
  );
}

export default EventCard;
