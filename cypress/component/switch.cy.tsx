import React from 'react'
import Switch from '@/components/switch.tsx'

describe('<Switch />', () => {
  it('El switch se prende y apaga correctamente', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Switch />)
    cy.get('label').click()
    cy.wait(500)
    cy.get('label').click()
    cy.get('fill-wRed-600').should('not.be.visible')

  })
})