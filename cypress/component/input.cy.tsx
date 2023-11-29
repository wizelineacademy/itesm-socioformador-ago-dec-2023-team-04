import React from 'react'
import { Input } from '@/components/input.tsx'

describe('<Input />', () => {
  it('El espacio de texto funciona correctamente', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Input />)
    cy.get('input').type('Hola Mundo')
  })
})