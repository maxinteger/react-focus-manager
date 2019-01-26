import * as React from 'react'
import { ReactChild, ReactElement, ReactNode } from 'react'
import { Direction, getFocusManager, IFocusGroup } from './GlobalFocusManager'
import { clamp, overflow } from './utils'

///

export interface Focusable {
  focusKey: string
  focused?: boolean
  onAction?: () => void
  onHover?: () => void
}

export enum FocusDirection {
  Row,
  Column
}

export enum FocusEdgeAction {
  Flow,
  Loop,
  Lock
}

enum FocusableItemType {
  Element,
  Group
}

interface FocusableItem {
  type: FocusableItemType
  focusKey: string
  childIndex: number
  onAction?: Focusable['onAction']
  groupRef?: IFocusGroup
}

interface Props {
  className?: string
  dir?: FocusDirection
  edgeAction?: FocusEdgeAction
  defaultKey?: Focusable['focusKey']
  resetFocusState?: boolean
}

interface State {
  focusIndex: any
  focused: boolean
  children: ReactNode
}

///

export class FocusGroup extends React.Component<Props, State> implements IFocusGroup {
  static defaultProps = {
    dir: FocusDirection.Column,
    edgeAction: FocusEdgeAction.Flow
  }

  state = {
    focusIndex: 0,
    focused: false,
    children: undefined
  }

  private defaultFocusIndex: number = 0
  private focusableItems: FocusableItem[] = []
  private continueFocusKey = 0
  private focusManager = getFocusManager()

  componentWillMount(): void {
    this.focusManager.addFocusGroup(this)
    const children = this.setFocusableItems(this.props.children)
    this.setDefaultFocusIndex()

    this.setState({
      children,
      focusIndex: this.defaultFocusIndex
    })
  }

  componentWillUnmount(): void {
    this.focusManager.removeFocusGroup(this)
  }

  componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
    const children = this.setFocusableItems(this.props.children)
    this.setDefaultFocusIndex()

    this.setState({ children })
  }

  render(): React.ReactNode {
    const { focusIndex, focused, children } = this.state
    const currentFK = this.focusableItems[focusIndex].focusKey

    return (
      <div>
        {React.Children.map(children, el => {
          if (isElement(el) && el.props.focusKey) {
            return React.cloneElement(el, { focused: focused && el.props.focusKey === currentFK })
          }
          return el
        })}
      </div>
    )
  }

  onFocus(): void {
    this.setState({ focused: true })
  }

  onBlur(): void {
    let newState: any = { focused: false }
    if (this.props.resetFocusState) {
      newState.focusIndex = this.defaultFocusIndex
    }
    this.setState(newState)
  }

  onNavigate(moveDir: Direction): boolean {
    const { dir } = this.props

    if (dir === FocusDirection.Row) {
      switch (moveDir) {
        case Direction.Right:
          return this.focusNextItem(+1)
        case Direction.Left:
          return this.focusNextItem(-1)
        default:
          return true
      }
    } else {
      switch (moveDir) {
        case Direction.Up:
          return this.focusNextItem(-1)
        case Direction.Down:
          return this.focusNextItem(+1)
        default:
          return true
      }
    }
  }

  onCancel(): void {}

  onEnter(): void {
    const { focusIndex } = this.state
    const item = this.focusableItems[focusIndex]
    if (item && item.onAction) {
      item.onAction()
    }
  }

  private focusNextItem(offset: number): boolean {
    const { edgeAction } = this.props
    const lastIndex = this.focusableItems.length - 1
    let focusIndex = this.state.focusIndex + offset

    switch (edgeAction) {
      case FocusEdgeAction.Flow:
        if (focusIndex < 0 || focusIndex > lastIndex) return true
        break
      case FocusEdgeAction.Loop:
        focusIndex = overflow(focusIndex, 0, lastIndex)
        break
      case FocusEdgeAction.Lock:
        focusIndex = clamp(focusIndex, 0, lastIndex)
        break
    }

    const focusItem = this.focusableItems[focusIndex]
    if (focusItem.type === FocusableItemType.Group && focusItem.groupRef) {
      this.focusManager.setChildGroup(this, focusItem.groupRef)
    } else {
      this.focusManager.setGroup(this)
    }

    this.setState({ focusIndex })

    return false
  }

  private onHover(focusKey: string) {
    const focusIndex = this.getFocusableByKey(focusKey)
    this.setState({ focusIndex })
  }

  private getFocusableByKey(focusKey: string) {
    return this.focusableItems.findIndex(f => f.focusKey === focusKey)
  }

  private setFocusableItems(children: ReactNode): ReactNode {
    this.focusableItems = []
    return this.prepChild(children)
  }

  private prepChild(children: ReactNode): ReactNode {
    return React.Children.map(children, (el: ReactChild, childIndex) => {
      if (isElement(el)) {
        if (el.props.focusKey) {
          const focusKey = el.props.focusKey
          this.focusableItems.push({
            type: FocusableItemType.Element,
            focusKey,
            childIndex,
            onAction: el.props.onAction
          })
          return React.cloneElement(el, {
            onHover: () => this.onHover(focusKey),
            focused: false
          })
        } else if (el.type === FocusGroup) {
          const data: FocusableItem = {
            type: FocusableItemType.Group,
            focusKey: (this.continueFocusKey++).toString(),
            childIndex
          }
          this.focusableItems.push(data)
          return React.cloneElement(el, { ref: (ref: FocusGroup) => (data.groupRef = ref) })
        } else {
          if (el.props.children) {
            return this.prepChild(el.props.children)
          }
          return el
        }
      }
      return el
    })
  }

  private setDefaultFocusIndex() {
    const { defaultKey } = this.props
    this.defaultFocusIndex = defaultKey ? this.getFocusableByKey(defaultKey) : 0
  }
}

///

function isElement(e: ReactChild): e is ReactElement<any> {
  return (e as ReactElement<any>).type !== undefined
}
