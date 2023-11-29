import React from 'react'
import Separator from '@/components/separator.tsx'

describe('<Separator />', () => {
  it('Renderiza Correctamente', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Separator />)
  })
})