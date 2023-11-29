import React from 'react'
import FileDropZone from '@/components/file-drop-zone.tsx'

describe('<FileDropZone />', () => {
  it('Esta listo para recibir Archivos', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<FileDropZone />)
  })
})