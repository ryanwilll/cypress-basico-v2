/// <reference types="Cypress" />
import { faker } from '@faker-js/faker';

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
    cy.get('#phone').type('abc', { delay: 200 }).should('have.value', '');
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

  it('digitar texto em todos os campos text', () => {
    cy.generateFakerInfo();
    cy.contains('button', 'Enviar').click();
  });

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"]')
      .check('feedback')
      .should('have.value', 'feedback');
  });

  it('marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]')
      .should('have.length', 3)
      .each(($el) => {
        cy.wrap($el).check().should('be.checked');
      });
  });

  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked');
  });

  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('input[type="file"]')
      .selectFile('cypress/fixtures/example.json')
      .then((input) => {
        expect(input[0].files[0].name).to.equal('example.json');
      });
  });

  it('seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('input[type="file"]')
      .should('not.have.value')
      .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
      .should((input) => {
        expect(input[0].files[0].name).to.eq('example.json');
      });
  });

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture('example.json').as('arquivoExemplo');
    cy.get('input[type="file"]')
      .selectFile('@arquivoExemplo')
      .should((input) => {
        expect(input[0].files[0].name).to.eq('example.json');
      });
  });

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.get('#privacy > a').should('have.attr', 'target', '_blank');
  });

  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.get('#privacy > a').invoke('removeAttr', 'target').click();
    cy.contains('Talking About Testing').should('be.visible');
  });
});
