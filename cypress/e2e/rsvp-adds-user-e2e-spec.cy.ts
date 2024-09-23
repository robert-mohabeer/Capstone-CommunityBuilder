describe('user added to rsvped event', () => {
    it('can visit the website', () => {
      cy.visit('localhost:8000')
    })
  
    it('create an event', () => {
      cy.visit('localhost:8000')
      cy.contains("Create an Event").click()
      cy.url().should('contain', 'create')
  
      cy.get('[id="eventname"]').type("Cypress EventName")
      cy.get('[id="location"]').type("Cypress Location")
      cy.get('[id="address"]').type("Cypress Address")
      cy.get('[id="date"]').type("Cypress Date")
      cy.get('[id="time"]').type("Cypress Time")
      cy.get('[id="desc"]').type("Cypress Description")
      cy.get('input[type="submit"]').click();
      cy.url().should('eq', 'http://localhost:8000/')
    })

    it('can not see user in people on event details', () => {
        cy.visit('localhost:8000')
        cy.contains("Cypress EventName").click()
        cy.contains('People').click()
        cy.get('[class*="people-section"]').contains("JohnS").should('not.exist')
    })
  
    it('can rsvp to the event', () => {
      cy.visit('localhost:8000')
      cy.contains('Cypress EventName')
      .invoke('attr', 'id')
      .as('idValue')
  
      cy.get('@idValue').then((idValue) => {
          cy.get('[id=button-event'+idValue+"]").click()
      })
    })

    it('can not see user in people on event details', () => {
        cy.contains("Cypress EventName").click()
        cy.contains('People').click()
        cy.get('[class*="people-section"]').contains("JohnS").should('exist')
    })
})