import React from 'react'
import TextArea from '@/components/text-area.tsx'

describe('<TextArea />', () => {
  it('El espacio de texto funciona correctamente', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<TextArea />)
    cy.get("textarea").type('Hola Mundo')
  })
})