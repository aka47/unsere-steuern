import { prisma } from "@/lib/prisma"

describe('Lebenseinkommen Rechner', () => {
  beforeEach(() => {
    // Login before each test
    cy.login();
  });

  it('should load the calculator, calculate and show results', () => {
    cy.visit('/lebenseinkommen/rechner');
    cy.url().should('include', '/lebenseinkommen/rechner');

    // Add assertions for important elements on the page
    cy.get('h3').contains('Lebenseinkommen-Rechner').should('exist');
    cy.get('input[id="currentIncome"]').type('100000');
    cy.get('input[id="currentAge"]').type('30');
    cy.get('button[id="savingsRate"]').click();
    cy.get('[role="option"]').contains('10%').click();
    cy.get('input[id="inheritanceAge"]').type('60');
    cy.get('input[id="inheritanceAmount"]').type('100000');
    cy.contains('button', 'Lebenseinkommen - Übersicht erstellen').click()

    cy.get('div').contains('Jährliche Aufschlüsselung').should('exist');
    cy.get('button').contains('Speichern').click();

    // Check the active persona via API request
    cy.request('/api/persona/active').then(response => {
      const persona = response.body;
      expect(persona.currentIncome).to.equal(100000);
      expect(persona.savingsRate).to.equal(0.1);
      expect(persona.inheritanceAge).to.equal(60);
      expect(persona.inheritanceAmount).to.equal(100000);
    });
  });
});

export {};