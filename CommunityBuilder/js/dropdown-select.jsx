// import { method } from "cypress/types/bluebird";
import React from "react";
import PropTypes from "prop-types";

// use numLikes directly! do not make a State variable
export default function DropDownMenu({
    options,
    filters, 
    add, 
    remove
}) {
    console.log("filters: ", filters)
    function myFunction() {
        document.getElementById("myDropdown").classList.toggle("show");
      }
      

  return (
    <div>
        <div className="dropdown">
            <button onClick={myFunction} className="dropbtn">Choose Accessibility Filters</button>
            <div id="myDropdown" className="dropdown-content">
                {options.map(function(option) {
                return (
                    <a onClick={()=>{add(option)}}>{option}</a>
                    )
                })}
            </div>
        </div>


        <div className="filter-container">
            {filters.map(function(filter) {
                return (
                    <div id="pointer">
                        <button className="remove-filter-button" onClick={() => {remove(filter)}}>X</button>
                        <div className="filter-text">{filter}</div>
                    </div>
                )
            })}
        </div>
    </div>
  )};

  Event.propTypes = {
    options: PropTypes.array.isRequired,
    filters:  PropTypes.array.isRequired
  };