import * as React from 'react'
import { Focusable } from '../react-mtv/FocusGroup'
import './Box.css'

interface Props {
  className?: string
  label: string
  width?: number
  height?: number
  focusKey: string
}

export function FocusableBox(props: Props): JSX.Element {
  const { label, className, width, height, focusKey } = props
  return (
    <Focusable focusKey={focusKey}>
      {({ focused, onMouseEnter }) => {
        return (
          <div
            className={`box f-box ${focused ? 'focused' : ''} ${className}`}
            style={{ width, height, lineHeight: height + 'px' }}
            onMouseEnter={onMouseEnter}
            onClick={() => {}}
          >
            {label}
          </div>
        )
      }}
    </Focusable>
  )
}
