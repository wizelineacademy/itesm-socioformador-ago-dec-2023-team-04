import React from 'react'
import DeleteButton from '@/components/delete-button.tsx'

describe('<DeleteButton />', () => {

  it('Abre el popup al presionar el boton', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<DeleteButton />)
    cy.get('button').click()
  })

})