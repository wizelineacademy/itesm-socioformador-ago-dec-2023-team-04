import Spacer from "@/components/spacer"

describe('spacer.cy.tsx', () => {
  it('playground', () => {

     cy.mount(<Spacer/>)

     //cy.get(Spacer).its('outerWidth').should('eq',500)

      
     cy.get('span').then(($element) => {
      const width = $element.width();
      const height = $element.height();
    
      cy.log(`Width: ${width}`);
      cy.log(`Height: ${height}`);
    });

  })
})