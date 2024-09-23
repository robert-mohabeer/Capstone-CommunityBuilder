import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import PropTypes from "prop-types";
import RsvpButton from "./rsvp-button";
import CommentBlock from "./comment";
import PeopleBlock from "./people";
import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents } from 'react-leaflet'
import MapMarker from "./mapMarker"


export default function EventDetails() {
  let { eventId } = useParams();


  const [eventDetails, setEventDetails] = useState(null);
  const [currentTab, setCurrentTab] = useState('Details'); // 'Details' or 'People' for the tab
  const [rsvpStatus, setStatus] = useState(false);
  const [comments, setComments] = useState([])
  const [numPeopleStatus, changeNumPeopleStatus] = useState(null)
  const [refetch, setRefetch] = useState(0)
  

  useEffect(() => {
    // Variable to track if the component is still mounted
    let isMounted = true;

    // Form the URL for the API endpoint
    const apiUrl = `/api/v1/events/${eventId}/`; // Make sure this matches your Flask route

    // Fetch event details from API
    fetch(apiUrl, { credentials: "same-origin"})
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (isMounted) {
          setEventDetails(data);
          
          
        }
        
      })
      .catch(error => {
        console.log(error);
      });

    // Cleanup function to set isMounted to false when the component unmounts
    return () => {
      isMounted = false;
    };
  }, [eventId]); // Dependency array includes eventId to refetch if the ID changes
  
  useEffect(() => {
    if (eventDetails) {
      setStatus(eventDetails.rsvped);
      changeNumPeopleStatus(eventDetails.numPeople);
    }
  }, [eventDetails, refetch]); // This effect runs when eventDetails changes

  const handleTabChange = tabName => {
    setCurrentTab(tabName);
  };

  const RSVPChange = (id) => {
    if(rsvpStatus == false){
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
    setStatus(!rsvpStatus) 
    // make post request to chnage rsvped status of event...
}

  
  const renderPeopleAndComments = () => {
    return (
      <div className="people-and-comments-container">
        <div className="comments-section">
          <h1>Comments</h1>
          <CommentBlock eventData={eventDetails}/>
        </div>
        <div className="people-section">
          
          <h1>People</h1>
            <div className="people-section-in">
              <PeopleBlock eventData={eventDetails}/>
            </div>
        </div>
      </div>
    );
  };



  if (!eventDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="event-details-container-top">
      <div className="event-details-header">{eventDetails.title}</div>
      <div className="eventd-rsvp">
        <RsvpButton rsvped={!rsvpStatus} eventId={eventDetails.eventid} numPeople={numPeopleStatus} onClick={() => RSVPChange(eventDetails.eventid)} />
      </div>
      
      <div className="event-details-container">
        <div className="event-details-tabs">
            <button 
            onClick={() => handleTabChange('Details')}
            className={`tab-button ${currentTab === 'Details' ? 'active' : ''}`}
            >
                Details</button>
            <button 
            onClick={() => handleTabChange('People')}
            className={`tab-button ${currentTab === 'People' ? 'active' : ''}`}
            >
                People</button>
        </div>
        <div className="event-details-content">
            {currentTab === 'Details' ? (
            <div className="event-details-container-tab">
                <div className="event-details-box">
                <h1>Details</h1>
                <p>Created by <a href={`/users/${eventDetails.owner}`}>{eventDetails.owner}</a></p>
                <p>{eventDetails.location}</p>
                <p>{eventDetails.address}</p>
                <p>{eventDetails.date}</p>
                <p>{eventDetails.time}</p>
                <p>{eventDetails.description}</p>
                <h2>Accessibility: </h2>
                <ul>
                  {eventDetails.filters.map((filter, index) => (
                    <li key={index}>{filter.label}</li>
                  ))}
                </ul>
                
                </div>
                <div className="event-details-map">
                <MapContainer center={[42.2808, -83.7430]} zoom={13} style={{ height: "60vh", width: "25vw" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapMarker url={eventDetails.url} eventid={eventDetails.eventid}/>
                      
                      
                </MapContainer>
                    
                </div>
                
            </div>
            
            ) : (
            
              renderPeopleAndComments()
            
            )}
        </div>
      </div>
    </div>
  );
}
