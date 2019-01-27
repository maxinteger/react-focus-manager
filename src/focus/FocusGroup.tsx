import React, { ReactChild, ReactElement, ReactNode } from 'react'
import { Direction, getFocusManager, IFocusGroup, NavigationResult } from './GlobalFocusManager'
import { clamp, overflow } from './utils'

///

export interface Focusable {
  focusKey: string
  focused?: boolean
  onAction?: () => void
  onHover?: () => void
  skip?: FocusSkip
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

export enum FocusSkip {
  None,
  Forward,
  Backward
}

enum Offset {
  next = 1,
  prev = -1
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
  skip?: FocusSkip
  groupRef?: IFocusGroup
}

interface Props {
  className?: string
  dir?: FocusDirection
  edgeAction?: FocusEdgeAction
  defaultKey?: Focusable['focusKey']
  resetFocusState?: boolean
  skip?: FocusSkip
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
    edgeAction: FocusEdgeAction.Flow,
    resetFocusState: false,
    skip: FocusSkip.None
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
    const { className } = this.props;
    const { focusIndex, focused, children } = this.state
    const currentFK = this.focusableItems[focusIndex].focusKey

    return (
      <div className={`focus-group ${className || ''} ${focused ? 'focused' : ''}`}>
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
    const focusItem = this.focusableItems[this.state.focusIndex]
    this.notifyFocusManger(focusItem)
    this.setState({ focused: true })
  }

  onBlur(): void {
    let newState: any = { focused: false }
    if (this.props.resetFocusState) {
      newState.focusIndex = this.defaultFocusIndex
    }
    this.setState(newState)
  }

  onNavigate(moveDir: Direction): NavigationResult {
    const { dir } = this.props

    if (dir === FocusDirection.Row) {
      switch (moveDir) {
        case Direction.Right:
          return this.updateFocusIndex(Offset.next)
        case Direction.Left:
          return this.updateFocusIndex(Offset.prev)
        default:
          return NavigationResult.Next
      }
    } else {
      switch (moveDir) {
        case Direction.Up:
          return this.updateFocusIndex(Offset.prev)
        case Direction.Down:
          return this.updateFocusIndex(Offset.next)
        default:
          return NavigationResult.Next
      }
    }
  }

  onCancel(): void {}

  onEnter(): void {
    const { focusIndex } = this.state
    const item = this.focusableItems[focusIndex]
    console.log('enter: ', item)
    if (item && item.onAction) {
      item.onAction()
    }
  }

  private updateFocusIndex(offset: Offset): NavigationResult {
    const { edgeAction } = this.props
    const lastIndex = this.focusableItems.length - 1
    let focusIndex = this.state.focusIndex + offset

    switch (edgeAction) {
      case FocusEdgeAction.Flow:
        if (focusIndex < 0 || focusIndex > lastIndex) return NavigationResult.Next
        break
      case FocusEdgeAction.Loop:
        focusIndex = overflow(focusIndex, 0, lastIndex)
        break
      case FocusEdgeAction.Lock:
        focusIndex = clamp(focusIndex, 0, lastIndex)
        break
    }

    let focusItem = this.focusableItems[focusIndex]
    do {
      if (focusIndex < 0 || focusIndex > lastIndex) return NavigationResult.Next

      if (
        focusItem.skip &&
        ((focusItem.skip === FocusSkip.Forward && offset === Offset.next) ||
          (focusItem.skip === FocusSkip.Backward && offset === Offset.prev))
      ) {
        focusIndex += offset
        focusItem = this.focusableItems[focusIndex]
      } else {
        break
      }
    } while (true)


    this.notifyFocusManger(focusItem)
    this.setState({ focusIndex })

    return NavigationResult.StopPropagation
  }

  private notifyFocusManger(focusItem: FocusableItem){
    if (focusItem) {
      if (focusItem.type === FocusableItemType.Group && focusItem.groupRef) {
        this.focusManager.setChildGroup(this, focusItem.groupRef)
      } else {
        this.focusManager.setGroup(this)
      }
    }
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
    return this.prepChild(children, new Set<string>())
  }

  private prepChild(children: ReactNode, focusKeySet: Set<string>): ReactNode {
    return React.Children.map(children, (el: ReactChild, childIndex) => {
      if (isElement(el)) {
        if (el.props.focusKey) {
          const focusKey = el.props.focusKey
          if (focusKeySet.has(focusKey)) {
            throw new Error(`Focus key must be unique inside the focus group: "${focusKey}"`)
          } else {
            focusKeySet.add(focusKey)
          }

          this.focusableItems.push({
            type: FocusableItemType.Element,
            focusKey,
            childIndex,
            skip: el.props.skip,
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
            skip: el.props.skip,
            childIndex
          }
          this.focusableItems.push(data)
          return React.cloneElement(el, { ref: (ref: FocusGroup) => (data.groupRef = ref) })
        } else {
          if (el.props.children) {
            return this.prepChild(el.props.children, focusKeySet)
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
