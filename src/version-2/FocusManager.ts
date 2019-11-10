import { FocusableComponent, FocusItemDescriptor, FocusItemType } from './types'
import { discoverFocusableChildren, findClosestFocusable, FOCUSABLE_ATTR, waitABit } from './utils'

export class FocusManager {
  private root?: Element
  private map = new Map<Element, FocusItemDescriptor>()
  private focusedElement?: Element = undefined

  public get activeElement() {
    return this.focusedElement
  }

  public setFocus(element: Element) {
    this.triggerBlur()
    this.focusedElement = element
    this.triggerFocus()
  }

  public registerRoot(root: FocusableComponent) {
    if (!root.ref) throw new Error('Missing root ref')

    if (this.root) throw new Error('Root already registered')

    const item = {
      component: root
    }
    this.root = root.ref
    this.map.set(this.root, item)
  }

  public unRegisterRoot() {
    this.map.clear()
  }

  public register(component: FocusableComponent) {
    // 1) check component reference
    if (!component.ref) throw new Error('Missing ref component')

    // 3) Find closest focusable group
    const parent = findClosestFocusable(component.ref)

    // 3) validate component
    if (!parent) throw new Error('Missing Focus root')

    if (
      component.type === FocusItemType.Element &&
      parent.getAttribute(FOCUSABLE_ATTR) === FocusItemType.Element
    )
      throw new Error('Focusable element can not contain other focusable element')

    // 4) Register component
    this.map.set(component.ref, { component })

    if (component.type === FocusItemType.Group) {
      this.updateGroupComponentChildren(component.ref)
    }

    this.updateGroupComponentChildren(parent)
  }

  public unRegister(component: FocusableComponent) {
    // FIXME: Timing!!!
    waitABit(() => {
      if (!component.ref) return
      const descriptor = this.map.get(component.ref)

      if (!descriptor || !descriptor.parent) return

      this.updateGroupComponentChildren(descriptor.parent)
    })
  }

  private updateGroupComponentChildren(parent: Element) {
    const descriptor = this.map.get(parent)

    if (!descriptor) return

    descriptor.children = discoverFocusableChildren(parent).reduce<FocusItemDescriptor[]>(
      (acc, el) => {
        const item = this.map.get(el)
        if (item) {
          item.parent = parent
          acc.push(item)
        }
        return acc
      },
      []
    )
  }

  private pathToRoot(element: Element): FocusItemDescriptor[] {
    debugger
    const result = []
    let descriptor = this.map.get(element)
    while (descriptor) {
      result.push(descriptor)
      descriptor = descriptor.parent && this.map.get(descriptor.parent)
    }
    return result
  }

  private triggerBlur() {
    if (!this.focusedElement) return
    const path = this.pathToRoot(this.focusedElement)
    for (let item of path) {
      if (item.component.onBlur(item) === false) break
    }
  }

  private triggerFocus() {
    if (!this.focusedElement) return
    const path = this.pathToRoot(this.focusedElement)
    for (let item of path) {
      if (item.component.onFocus(item) === false) break
    }
  }
}
