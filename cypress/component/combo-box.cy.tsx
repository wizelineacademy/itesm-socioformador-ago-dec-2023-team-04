import React from 'react'
import ComboBox from '@/components/combo-box.tsx'
import {useComboBox} from "react-aria";

describe('<ComboBox />', () => {
  it('Es funcional y Se puede escribir', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ComboBox />)
    cy.get('input').type('Hola Mundo')


  })
})