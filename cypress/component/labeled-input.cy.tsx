import { LabeledInput } from "@/components/labeled-input"

describe('labeled-input.cy.tsx', () => {
  it('playground', () => {
     cy.mount(<LabeledInput label='Hola'/>)

     cy.get('p').should('have.text','Hola')

     cy.get('Input').type("Hola")

     cy.get('Input').focus().should('have.css','outline')

  })
})