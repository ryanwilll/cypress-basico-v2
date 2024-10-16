describe('Página de privacidade CAC-TAT', () => {
  Cypress._.times(5, (index) => {
    it(
      'testa a página da política de privacidade de forma independente - ' +
        Number(index + 1),
      () => {
        cy.visit('./src/privacy.html');
        cy.contains('Talking About Testing').should('be.visible');
        cy.get('#white-background').should('be.visible');
      },
    );
  });
});
