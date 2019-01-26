import * as React from 'react'

import './Box.css'
import { Focusable } from './FocusGroup'

interface Props extends Focusable {
  className?: string
  label: string
  width?: number
  height?: number
}

export class FocusableBox extends React.PureComponent<Props> {
  render(): React.ReactNode {
    const { label, focused, className, onHover, onAction, width, height } = this.props
    return (
      <div
        className={`box f-box ${focused ? 'focused' : ''} ${className}`}
        style={{ width, height, lineHeight: height + 'px' }}
        onMouseEnter={onHover}
        onClick={onAction}
      >
        {label}
      </div>
    )
  }
}
