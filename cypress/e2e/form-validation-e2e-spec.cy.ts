describe('create event validation', () => {
  it('can visit the website', () => {
    cy.visit('localhost:8000')
  })

  it('can not see a form validation message', () => {
      cy.contains("Create an Event").click()
      cy.get('[class*="submission-group"]').contains("All fields required").should('not.exist')
  })

  it('can see a form validation message on invalid form submission', () => {
      cy.contains("Submit").click()
      cy.get('[class*="submission-group"]').contains("All fields required").should('exist')
  })

  it('can create a valid event', () => {
      cy.get('[id="eventname"]').type("Valid EventName")
      cy.get('[id="location"]').type("Valid Location")
      cy.get('[id="address"]').type("Valid Address")
      cy.get('[id="date"]').type("Valid Date")
      cy.get('[id="time"]').type("Valid Time")
      cy.get('[id="desc"]').type("Valid Description")
  })

  it('can sumbit valid event', () => {
      cy.get('input[type="submit"]').click();
      cy.url().should('eq', 'http://localhost:8000/')
  })
})