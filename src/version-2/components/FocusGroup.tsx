import { FocusDirection } from '../../focus'
import React from 'react'
import * as PropTypes from 'prop-types'
import {
  FocusableComponent,
  FocusableGroupChild,
  FocusableProps,
  FocusGroupStrategy,
  FocusItemDescriptor,
  FocusItemType
} from '../types'
import { FOCUSABLE_ATTR } from '../utils'

interface Props extends FocusableProps {
  children: FocusableGroupChild
  strategy?: () => FocusGroupStrategy
  dir: FocusDirection
}

export class FocusGroup extends React.Component<Props, {}> implements FocusableComponent {
  static contextTypes = {
    focusManager: PropTypes.object.isRequired
  }

  public readonly type = FocusItemType.Group
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
        focused: true
      }),
      { ref: this.onRef, [FOCUSABLE_ATTR]: FocusItemType.Group }
    )
  }

  public onFocus(item: FocusItemDescriptor): boolean | void {
    console.log('focus', this.type, item)
    return
  }

  public onBlur(item: FocusItemDescriptor): boolean | void {
    console.log('blur', this.type, item)
    return
  }
}
