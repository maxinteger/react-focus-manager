import React from 'react'
import { FocusDirection } from '../focus'

export interface FocusableProps {
  focusKey: string
}

export type FocusableChild = (params: {
  index: number
  focused: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}) => React.ReactElement<any>

export type FocusGroupStrategy = (currentIndex: number, items: Focusable[]) => number

interface FocusableComponentProps extends FocusableProps {
  children: FocusableChild
}

interface FocusGroupProps extends FocusableComponentProps {
  strategy?: () => FocusGroupStrategy
  dir: FocusDirection
}

export function Focusable({ focusKey, children }: FocusableComponentProps) {
  const node = children({
    index: 0,
    focused: false,
    onMouseEnter: () => {},
    onMouseLeave: () => {}
  })

  return React.cloneElement(node, { dataFocusElementKey: focusKey })
}

export function FocusGroup({ focusKey, children }: FocusGroupProps) {
  const node = children({
    index: 0,
    focused: false,
    onMouseEnter: () => {},
    onMouseLeave: () => {}
  })

  return React.cloneElement(node, { dataFocusGroupKey: focusKey })
}

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
interface FocusRowProps extends Omit<FocusGroupProps, 'dir' | 'children'> {
  children: React.ReactElement<any>[]
}
export function FocusRow({ children, focusKey }: FocusRowProps) {
  return (
    <FocusGroup focusKey={focusKey} dir={FocusDirection.Row}>
      {() => <div>{children}</div>}
    </FocusGroup>
  )
}

interface FocusColProps extends Omit<FocusGroupProps, 'dir' | 'children'> {
  children: React.ReactElement<any>[]
}
export function FocusCol({ children, focusKey }: FocusColProps) {
  return (
    <FocusGroup focusKey={focusKey} dir={FocusDirection.Row}>
      {() => <div>{children}</div>}
    </FocusGroup>
  )
}

function findFocusedNodeByKey(focusKey: string) {}

export class FocusManager {
  // private activeView: NodeNavTree;
}

class NodeNavTree {}
