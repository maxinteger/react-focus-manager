import React from 'react'
import * as PropTypes from 'prop-types'
import {
  FocusableComponent,
  FocusableGroupChild,
  FocusableProps,
  FocusItemDescriptor,
  FocusItemType
} from '../types'
import { FocusManager } from '../FocusManager'
import { FOCUSABLE_ATTR } from '../utils'

interface FocusRootProps extends FocusableProps {
  children: FocusableGroupChild
}

export class FocusRoot extends React.Component<FocusRootProps, {}> implements FocusableComponent {
  static childContextTypes = {
    focusManager: PropTypes.object
  }

  private focusManager = new FocusManager()

  public type = FocusItemType.Root
  public ref?: Element

  getChildContext = () => {
    return {
      focusManager: this.focusManager
    }
  }

  componentWillUnmount(): void {
    this.focusManager.unRegisterRoot()
  }

  private onRef = (ref?: Element) => {
    if (ref && this.ref !== ref) {
      this.ref = ref
      this.focusManager.registerRoot(this)
    }
  }

  render() {
    return React.cloneElement(
      this.props.children({
        index: 0,
        focused: true
      }),
      { ref: this.onRef, [FOCUSABLE_ATTR]: FocusItemType.Root }
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
