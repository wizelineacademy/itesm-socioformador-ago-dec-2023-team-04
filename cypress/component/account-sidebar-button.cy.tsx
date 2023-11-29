import React from 'react'
import AccountSidebarButton from '@/components/account-sidebar-button.tsx'

describe('<AccountSidebarButton />', () => {
  it('Despliega el Popover correctamente', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<AccountSidebarButton />)

    cy.get('[data-testid="account-sidebar-button"]').click()
    cy.get('[data-testid="account-sidebar-button-popover"]').should('be.visible')
  })

  it ('Cierra el Popover al presionar fuera', () =>{
    cy.mount(<AccountSidebarButton />)
    cy.get('[data-testid="account-sidebar-button"]').click()
    cy.wait(500);
    cy.get('[data-testid="account-sidebar-button"]').click()
    cy.get('[data-testid="account-sidebar-button-popover"]').should('not.exist')
  })
})