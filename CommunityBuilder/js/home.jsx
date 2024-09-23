import React, { useState, useEffect } from "react";
import Event from "./event";
import DropDownMenu from "./dropdown-select"

export default function Home() {
  const [rsvpedEvents, setRsvpedEvents] = useState([])
  const [allEvents, setAllEvents] = useState([])

  const [options, setOptions] = useState(["Low Vision", "Low Mobility", "Wheelchair Access", "Visual Support", "Hearing Support", "Mobility Aid Access", "Sensory Sensitivity", "Assistance Animals", "Language Access", "Virtual Access", "Transportation Access", "Child-Friendly"])
  const [filters, setFilters] = useState([])

  function fetchAllEvents() {
    var query = "?filters=" + filters.map((filter) => {return filter})
    var eventsUrl = (filters.length > 0) ? `/api/v1/events/${query}` : "/api/v1/events/"; 
    console.log("url: ", eventsUrl)
    fetch(eventsUrl, { credentials: "same-origin" })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        console.log("data: ", data)
        console.log("Events: ", data.all_events)
        setAllEvents([...data.all_events]);
        setRsvpedEvents(data.rsvped_events)
      })
      .catch((error) => console.log(error));
  }


  function addFilter(filterTag) {
    //console.log("adding filter....")
    //console.log(filterTag)
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

  function removeFilter(filterTag){
    const index = filters.indexOf(filterTag)
    if (index > -1) { // only splice array when item is found
        filters.splice(index, 1); // 2nd parameter means remove one item only
        setFilters([...filters])
        setOptions([...options, filterTag])
    } 
  }
  useEffect(() => {
    fetchAllEvents()
  }, [filters]);


  return (
    <div>

        <div className="home-page">
            <div id="left-side" className="home-left">
                <a id="create-event" className="home-button create-button" href="/create/">Create an Event</a>
                <a id="view-map" className="home-button create-button" href="/map/">View Map</a>
                <div className="rsvped-events">
                    <h2>Your upcoming events</h2>
                    <div className="all-events">
                    {rsvpedEvents.map((x) => (
                        <Event url={x.url} eventid={x.eventid}/>
                    ))}
                    </div>
                </div>
            </div>

            <div id="right-side" className="home-right">
                <DropDownMenu options={options} filters={filters} add={addFilter} remove={removeFilter} />
                <div className="all-events">
                {allEvents.map((x) => (
                    <Event url={x.url} eventid={x.eventid}/>
                ))}
                </div>
            </div>
        </div>
    </div>
  );
}