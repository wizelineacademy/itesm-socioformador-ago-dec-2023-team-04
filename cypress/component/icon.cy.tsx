import React from 'react'
import Icon from '@/components/icon.tsx'

describe('<Icon />', () => {
  it('Prueba iconos de diferentes formas tamaños y colores', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Icon name={'person'} size={"sm"}/> )
    cy.wait(500)
    cy.mount(<Icon name={'arrow_forward'} size={"xl"}/>)
    cy.wait(500)
    cy.mount(<Icon name={'arrow_forward'} size={"sm"} color={'fbbf24'}/>)


  })
})