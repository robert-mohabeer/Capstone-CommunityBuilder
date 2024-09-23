import React, { useState, useEffect, useRef, useMemo, useCallback} from "react";
import DropDownMenu from "./dropdown-select";
import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents } from 'react-leaflet'
//import {DraggableMarker} from "./draggable-marker"

export default function CreateEvent() {
  const [options, setOptions] = useState(["Low Vision", "Low Mobility", "Wheelchair Access", "Visual Support", "Hearing Support", "Mobility Aid Access", "Sensory Sensitivity", "Assistance Animals", "Language Access", "Virtual Access", "Transportation Access", "Child-Friendly"])
  const [filters, setFilters] = useState([])
  const [inputs, setInputs] = useState({})
  const [message, setMessage] = useState("")
  const [position, setPosition] = useState({
    lat: null,
    lng: null})

  function addOption(filterTag) {
    const index = filters.indexOf(filterTag)
    if (index == -1) { // only add when tag is not found
        setFilters([...filters, filterTag])
        var optionIndex = options.indexOf(filterTag)
        if(optionIndex > -1){
            options.splice(optionIndex, 1);
            setOptions([...options])
        }
    }
  }

  function removeOption(filterTag){
    const index = filters.indexOf(filterTag)
    if (index > -1) { // only splice array when item is found
        filters.splice(index, 1); // 2nd parameter means remove one item only
        setFilters([...filters])
        setOptions([...options, filterTag])
    } 
  }

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    console.log("inputs: ", inputs.valueOf())
    setInputs(values => ({...values, [name]: value}))
  }


  function handleSubmit(event) {
    event.preventDefault();
    console.log("inputs1: ", inputs.mapcoord1)
    console.log("inputs2: ", inputs.mapcoord2)
    const data = {
      eventname: inputs.eventname,
      location: inputs.location,
      address: inputs.address,
      date: inputs.date,
      time: inputs.time,
      desc: inputs.desc,
      mapcoord1: inputs.mapcoord1,
      mapcoord2: inputs.mapcoord2,
      filters: filters,
    };

    if (!data.eventname || !data.location || !data.address || !data.date || !data.time || !data.desc || !data.mapcoord1) {
      setMessage("All fields required");
      if(!data.mapcoord1){
        setMessage("Please click the map to select a location for your event")
      }
    }
    else{
      setMessage("");
      fetch(`/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(data),
      })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        setOptions(["Low Vision", "Low Mobility"]);
        setFilters([]);
        window.location.href = response['url'];
      })
      .catch((error) => console.log(error));
    }
  }


    const LocationFinderDummy = () => {
        const map = useMapEvents({
            click(e) {
                const latlng = e.latlng
                console.log(latlng);
                setPosition(latlng)
                setInputs(values => ({...values, mapcoord1: latlng.lat, mapcoord2: latlng.lng }))
                console.log("inputs: ", inputs)
            },
        });
        return null;
    };

  return(
    <div>
        <div className="title">Create an Event</div>
    <div className="tri-style">
      <div className="event-pane">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" for="eventname">Event Name</label>
              <input className="form-text-box" type="text" id="eventname" name="eventname" 
                value={inputs.eventname} onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" for="location">Event Location</label>
              <input className="form-text-box" type="text" id="location" name="location" 
                value={inputs.location} onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" for="address">Event Address</label>
              <input className="form-text-box" type="text" id="address" name="address" 
                value={inputs.address} onChange={handleChange}
              />  
            </div>
            <div className="form-group">
              <label className="form-label" for="date">Date of Event</label>
              <input className="form-text-box" type="text" id="date" name="date" 
                value={inputs.date} onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" for="time">Time of Event</label>
              <input className="form-text-box" type="text" id="time" name="time" 
                value={inputs.time} onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" for="desc">Description</label>
              <textarea className="form-text-area" id="desc" 
                name="desc" value={inputs.desc} onChange={handleChange}
              />
            </div>
            <div className="form-group">
                <input id="mapcoord1" type="hidden" for="mapcoord1" name="mapcoord1" value={inputs.mapcoord1}
                />
            </div>
            <div className="form-group">
                <input id="mapcoord2" type="hidden" for="mapcoord2" name="mapcoord2" value={inputs.mapcoord2}
                    />
            </div>
            <div className="submission-group">
              <input type="submit" className="form-button"/>
              <div className="message">{message}</div>
            </div>
          </form>
        </div>
        <div id="preferences">
          <div className="preferences-heading">Accessibility Preferences</div>
          <DropDownMenu options={options} filters={filters} 
            add={addOption} remove={removeOption} 
          />
        </div>
      </div>
      <MapContainer center={[42.2808, -83.7430]} zoom={13} style={{ height: "60vh", width: "30vw" }}>
      <LocationFinderDummy />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {position.lat ? 
                <Marker
                position={position}>
                </Marker> : 
                <></>}
            
        </MapContainer>
    </div>
    </div>
  );
};