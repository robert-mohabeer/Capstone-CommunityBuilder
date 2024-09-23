describe('event lifecycle', () => {
  it('can visit the website', () => {
    cy.visit('localhost:8000')
  })

  it('can visit create event page and use the form', () => {
    cy.visit('localhost:8000')
    cy.contains("Create an Event").click()
    cy.url().should('contain', 'create')

    cy.get('[id="eventname"]').type("Cypress EventName")
    cy.get('[id="location"]').type("Cypress Location")
    cy.get('[id="address"]').type("Cypress Address")
    cy.get('[id="date"]').type("Cypress Date")
    cy.get('[id="time"]').type("Cypress Time")
    cy.get('[id="desc"]').type("Cypress Description")
    cy.contains("Choose Accessibility Filters").click()
    cy.contains("Wheelchair Access").click()
    cy.contains("Sensory Sensitivity").click()
    cy.get('input[type="submit"]').click();
    cy.url().should('eq', 'http://localhost:8000/')
  })

  it('can see the event details in the home page', () => {
    cy.visit('localhost:8000')
    cy.get('[class*="home-right"]').should('contain', 'Cypress EventName')
    cy.contains("Choose Accessibility Filters").click()
    cy.contains("Wheelchair Access").click()
    cy.contains("Sensory Sensitivity").click()
    cy.get('[class*="home-right"]').should('contain', 'Cypress EventName')
    cy.contains('Cypress EventName').click({force: true})
    cy.url().should('contain', 'event/')
  })

  it('can rsvped and vice versa', () => {
    cy.visit('localhost:8000')
    cy.contains('Cypress EventName')
    .invoke('attr', 'id')
    .as('idValue')

    cy.get('@idValue').then((idValue) => {
        cy.get('[id=button-'+idValue+"]").click()
    })

    cy.reload()
    cy.get('[class*="home-left"]').contains("Cypress EventName").should('exist')
    cy.reload()
    
    cy.get('@idValue').then((idValue) => {
        cy.get('[id=button-'+idValue+"]").click()
        cy.reload()
    })

    cy.get('[class*="home-left"]').contains("Cypress EventName").should('not.exist')
    cy.reload()
  })
})