import React from 'react'
import List from '@/components/list.tsx'

describe('<List />', () => {
  it('Renderiza correctamente', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<List />)
  })
})