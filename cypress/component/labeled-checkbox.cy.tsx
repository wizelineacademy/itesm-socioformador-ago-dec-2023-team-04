import Checkbox from "@/components/checkbox"
import LabeledCheckbox from "@/components/labeled-checkbox"

describe('labeled-checkbox.cy.tsx', () => {
  it('El checkbox se marca y desmarca adecuadamente', () => {
    cy.mount(<Checkbox />)
    cy.get('.w-6').click()
    cy.wait(500)
    cy.get('.w-6').click()


  })
})