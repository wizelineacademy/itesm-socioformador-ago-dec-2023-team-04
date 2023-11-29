import React from 'react'
import TextField from '@/components/text-field.tsx'

describe('<TextField />', () => {
  it('El espacio de texto funciona correctamente', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<TextField />)
    cy.get("input").type('Hola Mundo')
  })
})