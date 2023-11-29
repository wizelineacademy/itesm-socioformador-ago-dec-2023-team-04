import React from 'react'
import Select from '@/components/select.tsx'

describe('<Select />', () => {
  it('Renderiza Correctamente', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Select/>)
  })
})