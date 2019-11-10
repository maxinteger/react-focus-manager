import * as React from 'react'

import './Box.css'

interface Props {
  className?: string
  label?: string
  width?: number
  height?: number
}

export class Box extends React.PureComponent<Props> {
  render(): React.ReactNode {
    const { className, label, width, height } = this.props
    return (
      <div className={`box ${className}`} style={{ width, height, lineHeight: height + 'px' }}>
        {label}
      </div>
    )
  }
}
