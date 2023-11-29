import React from 'react'
import { Button } from '@/components/button.tsx'

describe('<Button />', () => {
  it('Verifica que se activa al presionarlo', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Button variant='contained' size='xl'>Boton</Button>)

    cy.get('Button').click()
    cy.get('Button').should('be.enabled')
  })
})