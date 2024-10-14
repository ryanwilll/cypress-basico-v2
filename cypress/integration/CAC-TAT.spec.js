/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', () => {
  beforeEach(() => {
    cy.visit('./src/index.html');
  });

  const longText = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam repellat similique incidunt quo voluptatem consequatur mollitia cum fuga temporibus quam velit, voluptate architecto amet sint possimus ipsum, sequi, minima maxime.`;

  it('verifica o título da aplicação', () => {
    cy.title().should('eq', 'Central de Atendimento ao Cliente TAT');
  });

  it('preenche os campos obrigatórios e envia o formulário', () => {
    cy.get('#firstName').type('João', { delay: 0 });
    cy.get('#lastName').type('da Silva Sauro', { delay: 0 }, { delay: 0 });
    cy.get('#email').type('joaodino@gmail.com', { delay: 0 });
    cy.get('#open-text-area').type(longText, { delay: 0 });
    cy.contains('button', 'Enviar').click();
    cy.get('.success').should('be.visible');
  });

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.get('#firstName').type('João', { delay: 0 });
    cy.get('#lastName').type('da Silva Sauro', { delay: 0 });
    cy.get('#email').type('joaodino.gmail.com', { delay: 0 });
    cy.get('#open-text-area').type(longText, { delay: 0 });
    cy.contains('button', 'Enviar').click();
    cy.get('.error').should('be.visible');
  });

  it('campo numero de telefone permanece vazio após inserir valor não numérico', () => {
    cy.get('#phone').type('abc').should('have.value', '');
  });

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.get('#firstName').type('João', { delay: 0 });
    cy.get('#lastName').type('da Silva Sauro', { delay: 0 });
    cy.get('#email').type('joaodino@gmail.com', { delay: 0 });
    cy.get('#open-text-area').type(longText, { delay: 0 });
    cy.get('#phone-checkbox').check();
    cy.contains('button', 'Enviar').click();
    cy.get('.error').should('be.visible');
  });

  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName')
      .type('João', { delay: 0 })
      .should('have.value', 'João')
      .clear()
      .should('have.value', '');
    cy.get('#lastName')
      .type('da Silva Sauro', { delay: 0 })
      .clear()
      .should('have.value', '');
    cy.get('#email')
      .type('joaodino@gmail.com', { delay: 0 })
      .should('have.value', 'joaodino@gmail.com')
      .clear()
      .should('have.value', '');
    cy.get('#phone')
      .type('123456789', { delay: 0 })
      .should('have.value', '123456789')
      .clear()
      .should('have.value', '');
  });

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.contains('button', 'Enviar').click();
    cy.get('.error').should('be.visible');
  });

  it('envia o formulário com sucesso usando um comando customizado', () => {
    cy.fillMandatoryFieldsAndSubmit();
    cy.get('.success').should('be.visible');
  });

  it('envia o formulário preenchido dinamicamente', () => {
    cy.fillMandatoryFieldsAndSubmitDinamic(
      'Arthur',
      'Biruleibe',
      'arthurzinhoreidelas@gmail.com',
      'Teste Dois',
    );
    cy.get('.success').should('be.visible');
  });

  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#product').select('YouTube').should('have.value', 'youtube');
  });

  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product').select('mentoria').should('have.value', 'mentoria');
  });

  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product').select(1).should('has.value', 'blog');
  });

  it('seleciona um produto aleatorio', () => {
    cy.get('select option')
      .not('[disabled]')
      .its('length', { log: false })
      .then((numeroItens) => {
        cy.get('#product').select(Cypress._.random(1, numeroItens));
      });
  });
});
