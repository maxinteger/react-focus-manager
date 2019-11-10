import React from 'react'
import { Focusable } from '../react-mtv/FocusGroup'

/**
 * TODO:
 * - init focus
 * - update focus after item was removed
 * - set focus on any item
 */

export enum FocusItemType {
  Root = 'root',
  Group = 'group',
  Element = 'element'
}

export interface FocusableComponent {
  ref?: Element
  type: FocusItemType

  onBlur(item: FocusItemDescriptor): boolean | void
  onFocus(item: FocusItemDescriptor): boolean | void
}

export interface FocusableProps {
  focusKey?: string
}

export type FocusableChild = (
  params: {
    index: number
    focused: boolean
    onMouseEnter: () => void
    onMouseLeave: () => void
  }
) => React.ReactElement<any>

export type FocusableGroupChild = (
  params: {
    index: number
    focused: boolean
  }
) => React.ReactElement<any>

export type FocusGroupStrategy = (currentIndex: number, items: Focusable[]) => number

///

export interface FocusItemDescriptor {
  component: FocusableComponent
  parent?: Element
  children?: FocusItemDescriptor[]
}
