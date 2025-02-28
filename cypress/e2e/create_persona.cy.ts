describe('create persona', () => {
  it('save persona', () => {
    cy.login()
    cy.visit('http://localhost:3000/lebenseinkommen/rechner')
    cy.get('input[id="currentIncome"]').type('100000')
    cy.get('input[id="currentAge"]').type('30')
    cy.get('button[id="savingsRate"]').click()
    cy.get('[role="option"]').contains('10%').click();

    cy.get('input[id="inheritanceAge"]').type('60')
    cy.get('input[id="inheritanceAmount"]').type('100000')
    cy.contains('button', 'Lebenseinkommen - Übersicht erstellen').click()
    cy.contains('button', 'Speichern').click()




    cy.window().then((win) => {
      const session = win.sessionStorage.getItem('next-auth.session-token')

      expect(session).to.exist

      cy.wrap(win).its('__NEXT_AUTH').then((auth) => {
        const currentPersona = auth.session?.currentPersona
        expect(currentPersona).to.exist
        expect(currentPersona.currentIncome).to.equal(100000)
        expect(currentPersona.currentAge).to.equal(30)
        expect(currentPersona.savingsRate).to.equal(0.1)
        expect(currentPersona.inheritanceAge).to.equal(60)
        expect(currentPersona.inheritanceAmount).to.equal(100000)
        expect(currentPersona.name).to.equal('You')
      })
    })

    cy.get('button[id="savePersona"]').click()
  })
})