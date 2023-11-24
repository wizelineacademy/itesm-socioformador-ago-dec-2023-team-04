import { SidebarButton } from "@/components/sidebar-button"

describe('sidebar-button.cy.tsx', () => {
  it('playground', () => {
    cy.mount(<SidebarButton href="/" className="w-full"></SidebarButton>)
  })
})