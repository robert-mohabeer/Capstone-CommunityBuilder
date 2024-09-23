describe('navigation tests', () => {
    it('can visit the website', () => {
      cy.visit('localhost:8000')
    })
  
    it('can visit the map page', () => {
        cy.visit('localhost:8000')
        cy.get('[class*="header-links"]').contains("Map").click()
        cy.url().should('contain', '/map')
    })

    it('can visit the profile page', () => {
        cy.visit('localhost:8000')
        cy.get('[class*="header-links"]').contains("Profile").click()
        cy.url().should('contain', 'users/John')
        
    })
  
    it('can visit the home page from right link', () => {
        cy.visit('localhost:8000')
        cy.get('[class*="rsvped-events"]').contains("Nature Hike").click()
        cy.get('[class*="header-links"]').contains("Home").click()
        cy.url().should('eq', 'http://localhost:8000/')
      
    })

    it('can visit the home page from icon', () => {
        cy.visit('localhost:8000')
        cy.get('[class*="rsvped-events"]').contains("Nature Hike").click()
        cy.get('[class*="header-links"]').get('img').click()
        cy.url().should('eq', 'http://localhost:8000/')
        
    })

    it('can visit the home page from CommunityBuilder title', () => {
        cy.visit('localhost:8000')
        cy.get('[class*="rsvped-events"]').contains("Nature Hike").click()
        cy.get('[class*="header-links"]').contains("Community Builder").click()
        cy.url().should('eq', 'http://localhost:8000/')
    })
  })