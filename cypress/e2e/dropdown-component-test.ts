import DropDownMenu from "../../CommunityBuilder/js/dropdown-select"
import React from "react"

describe('<DropDownMenu />', () => {
  it('can visit the website', () => {
    cy.visit('localhost:8000')
  })

  it('mounts', () => {
    cy.mounts(<DropDownMenu />)
  })

  it('check filters empty', () => {
    cy.its('filters').invoke('getState').its('key').should('eq', 0)
  })

  it('add filters', () => {
    cy.contains("dropdown").click()
    cy.contains("Choose Accessibility Filters").click()
    cy.contains("Low Mobility").click()
    cy.contains("Wheelchair Access").click()
  })

  it('check filters size', () => {
    cy.its('filters').invoke('getState').its('key').should('eq', 2)
  })

  it('reload and check filters size again', () => {
    cy.reload()
    cy.its('filters').invoke('getState').its('key').should('eq', 2)
  })
})