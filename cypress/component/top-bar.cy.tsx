import React from 'react'
import TopBar from '@/components/top-bar.tsx'

describe('<TopBar />', () => {
  it('Renderiza correctamente atributos pasados por fuera', () => {
    // see: https://on.cypress.io/mounting-react

    cy.mount(<TopBar subtitle={'hola'}/>)
    cy.contains('hola').should('have.text', 'hola')
  })
})