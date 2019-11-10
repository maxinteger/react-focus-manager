import React from 'react'
import * as PropTypes from 'prop-types'
import {
  FocusableChild,
  FocusableComponent,
  FocusableProps,
  FocusItemDescriptor,
  FocusItemType
} from '../types'
import { FOCUSABLE_ATTR } from '../utils'

interface FocusElementProps extends FocusableProps {
  children: FocusableChild
}

interface FocusElementState {
  focused: boolean
}

export class FocusElement extends React.Component<FocusElementProps, FocusElementState>
  implements FocusableComponent {
  static contextTypes = {
    focusManager: PropTypes.object.isRequired
  }

  state: FocusElementState = {
    focused: false
  }

  public type = FocusItemType.Element
  public ref?: Element

  componentWillUnmount(): void {
    this.context.focusManager.unRegister(this)
  }

  componentDidMount(): void {
    this.context.focusManager.register(this)
  }

  private onRef = (ref?: Element) => {
    if (ref && this.ref !== ref) {
      this.ref = ref
    }
  }

  render() {
    return React.cloneElement(
      this.props.children({
        index: 0,
        focused: this.state.focused,
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave
      }),
      { ref: this.onRef, [FOCUSABLE_ATTR]: FocusItemType.Element }
    )
  }

  private onMouseEnter = () => {
    this.context.focusManager.setFocus(this.ref)
  }

  private onMouseLeave() {}

  onFocus(item: FocusItemDescriptor): boolean | void {
    this.setState({ focused: true })
  }

  onBlur(item: FocusItemDescriptor): boolean | void {
    this.setState({ focused: false })
  }
}
