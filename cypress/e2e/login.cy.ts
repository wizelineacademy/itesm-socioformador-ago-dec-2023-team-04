describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/')

    cy.get('input[name="username"]').type('A00517124@tec.mx')

    cy.get('input[name="password"]').type('Li67WfWjH3Qx2Z')

    cy.get('button[name="action"]').click({ multiple: true , force: true})


  })
})