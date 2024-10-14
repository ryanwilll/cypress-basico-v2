import { faker } from '@faker-js/faker';

Cypress.Commands.add('fillMandatoryFieldsAndSubmit', () => {
  cy.get('#firstName').type('João', { delay: 0 });
  cy.get('#lastName').type('da Silva Sauro', { delay: 0 });
  cy.get('#email').type('Joao@gmail.com', { delay: 0 });
  cy.get('#open-text-area').type('Teste', { delay: 0 });
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add(
  'fillMandatoryFieldsAndSubmitDinamic',
  (nome, sobrenome, email, mensagem) => {
    cy.get('#firstName').type(nome, { delay: 0 });
    cy.get('#lastName').type(sobrenome), { delay: 0 };
    cy.get('#email').type(email, { delay: 0 });
    cy.get('#open-text-area').type(mensagem, { delay: 0 });
    cy.contains('button', 'Enviar').click();
  },
);

Cypress.Commands.add('generateFakerInfo', () => {
  cy.get('#firstName').type(faker.name.firstName(), { delay: 0 });
  cy.get('#lastName').type(faker.name.lastName(), { delay: 0 });
  cy.get('#email').type(faker.internet.email(), { delay: 0 });
  cy.get('#open-text-area').type(faker.lorem.paragraph(20), { delay: 0 });
});
