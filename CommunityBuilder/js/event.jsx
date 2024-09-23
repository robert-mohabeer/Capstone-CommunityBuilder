// import { method } from "cypress/types/bluebird";
import PropTypes from "prop-types";
import RsvpButton from "./rsvp-button";
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

// use numLikes directly! do not make a State variable
export default function Event({
    eventid,
    url
}) {

    const [rsvpStatus, changeRsvpStatus] = useState(true)
    const [numPeopleStatus, changeNumPeopleStatus] = useState(0)

    const [eventData, setEvent] = useState({})
    function fetchEvent(url){
        fetch(url, { credentials: "same-origin" })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            const event = {
                eventid: data.eventid,
                title: data.title,
                date: data.date,
                time: data.time,
                location: data.location,
                address: data.address,
                rsvped: data.rsvped,
                numPeople: data.rsvpers.length,
                rsvpedPeople: data.rsvpers,
                userOwned: data.userOwned
            }
            console.log("data: ", data)
            console.log("event: ", event)
            changeRsvpStatus(data.rsvped)
            changeNumPeopleStatus(event.numPeople)
            setEvent(event)
            changeNumPeopleStatus(event.numPeople); 
            changeRsvpStatus(!event.rsvped); 
        })
        .catch((error) => console.log(error));
    }

    useEffect(() => {
        console.log("fetching...")
        fetchEvent(url)
      }, [url]);

    const RSVPChange = (id) => {
        if(rsvpStatus == true){
            changeNumPeopleStatus(numPeopleStatus+1)
            fetch(`/api/v1/rsvps/?eventid=${id}`, {
            method: "POST",
            headers: { "credentials": "same-origin" }});
        } else {
            changeNumPeopleStatus(numPeopleStatus-1)
            fetch(`/api/v1/rsvps/${id}`, {
            method: "DELETE",
            headers: { "credentials": "same-origin" }});
        }
        changeRsvpStatus(!rsvpStatus) 
        // make post request to chnage rsvped status of event...
    }

    const deleteEvent = id => {
        fetch(`/api/v1/event/${id}`, {
        method: "DELETE",
        headers: { "credentials": "same-origin" }})
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            window.location.href = "/"
            return response.json();
        });
  }

  return (
    <div className="event">
        <div className="event-top">
            <Link to={`/event/${eventData.eventid}`}>
                <div className="event-title" id={"event"+eventData.eventid}>{eventData.title}</div>
            </Link>
            
            <div className="rsvp-right">
                <RsvpButton rsvped={rsvpStatus} eventId={eventData.eventid} numPeople={numPeopleStatus} onClick={() => RSVPChange(eventData.eventid)} />
                {eventData.userOwned ? (<button class="delete-button" onClick={()=>{deleteEvent(eventData.eventid)}}>Delete Event</button>) : <></>}
            </div>
        </div>
        <div>{eventData.date} - {eventData.time}</div>
        <div>{eventData.location}, {eventData.address}</div>
    </div>
  )};

  Event.propTypes = {
    title: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    location: PropTypes.bool.isRequired,
    address: PropTypes.func.isRequired,
    rsvped: PropTypes.func.isRequired,
    numPeople: PropTypes.func.isRequired,
  };