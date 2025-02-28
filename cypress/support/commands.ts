/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email?: string, password?: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  // Get CSRF token first
  cy.request('/api/auth/csrf')
    .then((response) => {
      const csrfToken = response.body.csrfToken;

      // Now perform the login
      cy.request({
        method: 'POST',
        url: '/api/auth/callback/credentials',
        body: { email, password, csrfToken },
        failOnStatusCode: false,
        headers: {
          'Content-Type': 'application/json',
        }
      }).then((loginResponse) => {
        // If login successful, visit the home page
        if (loginResponse.status === 200) {
          // Check the user's active persona
          cy.request('/api/persona/active').then(personaResponse => {
            cy.log('Active Persona:', personaResponse.body);
          });

          cy.visit('/');
        } else {
          // If login failed through API, try UI login
          cy.visit('/auth');

          // Make sure we're on the signin tab
          cy.get('[role="tab"]').contains('Sign In').click();

          // Fill in the login form
          cy.get('#signin-email').type(email);
          cy.get('#signin-password').type(password);

          // Submit the form
          cy.get('form').contains('Anmelden').click();

          // Wait for the redirect and verify we're logged in
          cy.url().should('not.include', '/auth');

          // Verify the header shows authenticated state
          cy.get('header').within(() => {
            cy.get('[data-testid="persona-selector"]').should('exist');
          });

          // Check the user's active persona after UI login
          cy.request('/api/persona/active').then(personaResponse => {
            cy.log('Active Persona:', personaResponse.body);
          });
        }
      });
    });
});

// New command to verify active persona
Cypress.Commands.add('verifyActivePersona', (expectedValues: Partial<{
  name: string;
  description: string;
  initialAge: number;
  currentAge: number;
  currentIncome: number;
  savingsRate: number;
  inheritanceAge: number | null;
  inheritanceAmount: number;
  vatRate: number;
  vatApplicableRate: number;
}>) => {
  // Get the active persona from the API
  cy.request({
    method: 'GET',
    url: '/api/persona/active',
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status).to.equal(200);
    const activePersona = response.body;

    // Verify each provided expected value
    Object.entries(expectedValues).forEach(([key, value]) => {
      expect(activePersona[key]).to.equal(value, `Expected ${key} to be ${value} but got ${activePersona[key]}`);
    });
  });
});

// Add a command to check if we're logged in
Cypress.Commands.add('checkLoginStatus', () => {
  cy.request('/api/auth/session')
    .then((response) => {
      cy.log('Session status:', response.body);
      return response.body?.user;
    });
});

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      login(email?: string, password?: string): Chainable<void>
      verifyActivePersona(expectedValues: Partial<{
        name: string;
        description: string;
        initialAge: number;
        currentAge: number;
        currentIncome: number;
        savingsRate: number;
        inheritanceAge: number | null;
        inheritanceAmount: number;
        vatRate: number;
        vatApplicableRate: number;
      }>): Chainable<void>
      checkLoginStatus(): Chainable<any>
    }
  }
}

export {};