import React from 'react'
import TimeField from '@/components/time-field.tsx'
import {type AriaTimeFieldProps, mergeProps, useFocusRing, useLocale, useTimeField, VisuallyHidden} from 'react-aria';

describe('<TimeField />', () => {
  it('Renderiza correctamente el componente', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<TimeField />)
  })
})