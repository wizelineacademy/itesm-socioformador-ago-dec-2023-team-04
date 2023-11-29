import React from 'react'
import Component from '@/components/list-box.tsx'

describe('<Component />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Component />)
  })
})