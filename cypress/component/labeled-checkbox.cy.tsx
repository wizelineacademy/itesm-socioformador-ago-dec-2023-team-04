import Checkbox from "@/components/checkbox"
import LabeledCheckbox from "@/components/labeled-checkbox"

describe('labeled-checkbox.cy.tsx', () => {
  it('playground', () => {
    cy.mount(<Checkbox/>)

    cy.get('input')


  })
})