import { LabeledInput } from "@/components/labeled-input"

describe('labeled-input.cy.tsx', () => {
  it('El espacio de texto funciona correctamente', () => {
     cy.mount(<LabeledInput label='Titulo'/>)

      cy.get('input').type('Hola Mundo')

  })
})