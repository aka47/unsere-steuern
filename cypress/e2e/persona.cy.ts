describe('Persona Management', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/lebenseinkommen/rechner');
  });

  it('should update active persona when form is submitted', () => {
    // Fill out the persona form
    const testValues = {
      name: 'Test Persona',
      description: 'A test persona',
      initialAge: 25,
      currentAge: 25,
      currentIncome: 50000,
      savingsRate: 0.2,
      inheritanceAge: 45,
      inheritanceAmount: 100000,
      vatRate: 19,
      vatApplicableRate: 70
    };

    // Fill in form fields
    cy.get('input[name="name"]').clear().type(testValues.name);
    cy.get('textarea[name="description"]').clear().type(testValues.description);
    cy.get('input[name="initialAge"]').clear().type(testValues.initialAge.toString());
    cy.get('input[name="currentIncome"]').clear().type(testValues.currentIncome.toString());
    cy.get('input[name="savingsRate"]').clear().type((testValues.savingsRate * 100).toString());
    cy.get('input[name="inheritanceAge"]').clear().type(testValues.inheritanceAge.toString());
    cy.get('input[name="inheritanceAmount"]').clear().type(testValues.inheritanceAmount.toString());
    cy.get('input[name="vatRate"]').clear().type(testValues.vatRate.toString());
    cy.get('input[name="vatApplicableRate"]').clear().type(testValues.vatApplicableRate.toString());

    // Submit the form
    cy.get('form').submit();

    // Wait for the form submission and API update
    cy.wait(1000);

    // Verify the active persona matches our input
    cy.verifyActivePersona(testValues);

    // Reload the page and verify the values persist
    cy.reload();
    cy.verifyActivePersona(testValues);
  });

  it('should load existing persona values into form', () => {
    // Get the current active persona
    cy.request('/api/persona/active').then((response) => {
      const activePersona = response.body;

      // Verify form fields match the active persona
      cy.get('input[name="name"]').should('have.value', activePersona.name);
      cy.get('textarea[name="description"]').should('have.value', activePersona.description);
      cy.get('input[name="initialAge"]').should('have.value', activePersona.initialAge);
      cy.get('input[name="currentIncome"]').should('have.value', activePersona.currentIncome);
      cy.get('input[name="savingsRate"]').should('have.value', activePersona.savingsRate * 100);
      cy.get('input[name="inheritanceAge"]').should('have.value', activePersona.inheritanceAge);
      cy.get('input[name="inheritanceAmount"]').should('have.value', activePersona.inheritanceAmount);
      cy.get('input[name="vatRate"]').should('have.value', activePersona.vatRate);
      cy.get('input[name="vatApplicableRate"]').should('have.value', activePersona.vatApplicableRate);
    });
  });
});

export {};