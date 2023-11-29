import React from 'react'
import TopBarPageTemplate from '@/components/top-bar-page-template.tsx'
import { Button } from '@/components/button.tsx'

describe('<TopBarPageTemplate />', () => {
  it('Renderiza correctamente atributos pasados por fuera', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<TopBarPageTemplate topBarItems={'HOLA'}/>)
    cy.contains('HOLA').should('have.text', 'HOLA')
  })
})