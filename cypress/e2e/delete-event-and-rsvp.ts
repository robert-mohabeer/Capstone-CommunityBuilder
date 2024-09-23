import DropDownMenu from "../../CommunityBuilder/js/dropdown-select"
import React from "react"

describe('delete-event-and-rsvp', () => {
  it('can visit the website', () => {
    cy.visit('localhost:8000')
  })

  it('create event', () => {
    cy.contains("Create an Event").click()
    cy.get('[id="eventname"]').type("EventTest")
    cy.get('[id="location"]').type("LocationTest")
    cy.get('[id="address"]').type("AddressTest")
    cy.get('[id="date"]').type("DateTest")
    cy.get('[id="time"]').type("TimeTest")
    cy.get('[id="desc"]').type("DescriptionTest")
    cy.get('input[type="submit"]').click();
  })

  it('create rsvp', () => {
    
  })
})