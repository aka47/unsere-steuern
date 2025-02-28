describe('Authentication', () => {
  beforeEach(() => {
    // Start from a clean slate
    cy.visit('/auth');
  });

  it('should show login form by default', () => {
    cy.get('[role="tab"]').contains('Sign In').should('have.attr', 'aria-selected', 'true');
    cy.get('#signin-email').should('exist');
    cy.get('#signin-password').should('exist');
  });

  it('should login successfully with default credentials', () => {
    cy.login();

    // Verify we're redirected away from auth
    cy.url().should('not.include', '/auth');

    // Verify authenticated header elements
    cy.get('header').within(() => {
      cy.get('[data-testid="persona-selector"]').should('exist');
      cy.get('a[href="/profile"]').should('exist');
    });
  });

  it('should show error message with invalid credentials', () => {
    cy.get('[role="tab"]').contains('Sign In').click();
    cy.get('#signin-email').type('wrong@example.com');
    cy.get('#signin-password').type('wrongpassword');
    cy.get('form').contains('Anmelden').click();

    // Verify error message
    cy.get('.text-red-500').should('contain', 'Invalid email or password');

    // Verify we're still on auth page
    cy.url().should('include', '/auth');
  });

  it('should allow switching between sign in and sign up tabs', () => {
    // Click sign up tab
    cy.get('[role="tab"]').contains('Sign Up').click();

    // Verify sign up form fields
    cy.get('#signup-name').should('exist');
    cy.get('#signup-email').should('exist');
    cy.get('#signup-password').should('exist');

    // Switch back to sign in
    cy.get('[role="tab"]').contains('Sign In').click();

    // Verify sign in form fields
    cy.get('#signin-email').should('exist');
    cy.get('#signin-password').should('exist');
  });
});

export {};