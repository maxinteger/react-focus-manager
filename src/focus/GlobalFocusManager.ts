export enum Direction {
	Up,
	Down,
	Right,
	Left
}

enum Key {
	RETURN = 0x0D,
	ESCAPE = 0x1B,
	LEFT = 0x25,
	UP = 0x26,
	RIGHT = 0x27,
	DOWN = 0x28,
}

export enum NavigationResult {
	Next,
	StopPropagation
}

export interface IFocusGroup {
	onFocus(): void

	onBlur(): void

	onNavigate(dir: Direction): NavigationResult

	onCancel(): void

	onEnter(): void
}

class GlobalFocusManager {
	private stack: IFocusGroup[] = []

	constructor() {
		window.addEventListener('keydown', this.onKeyDown)
	}

	public addFocusGroup(fg: IFocusGroup) {
		if (!this.stack.length) {
			this.pushActiveGroup(fg)
		}
	}

	public removeFocusGroup(fg: IFocusGroup) {
		this.stack.length = this.stack.indexOf(fg)
	}

	public setGroup(group: IFocusGroup) {
		const stack = this.stack

		const idx = stack.indexOf(group) + 1
		stack.splice(idx).reverse().map(f => f.onBlur())
	}

	public setChildGroup(parent: IFocusGroup, activeFocusGroup: IFocusGroup) {
		this.setGroup(parent)
		this.pushActiveGroup(activeFocusGroup)
	}

	public replaceActiveGroup(fg: IFocusGroup) {
		const prevFg = this.stack.pop()
		if (prevFg) prevFg.onBlur()
		this.pushActiveGroup(fg)
	}

	public pushActiveGroup(fg: IFocusGroup) {
		this.stack.push(fg)
		fg.onFocus()
	}

	private onKeyDown = (event: KeyboardEvent) => {
		const key: Key = event.keyCode
		const lastIdx = this.stack.length - 1
		const fg = this.stack[lastIdx]

		if (key in Key) event.preventDefault()

		switch (key) {
			case Key.RETURN:
				return fg.onEnter()
			case Key.ESCAPE:
				return fg.onCancel()
			default: return this.handleNavigation(lastIdx, key)
		}
	}

	private handleNavigation(idx: number, key: number) {
		if (idx >= 0) {
			const fg = this.stack[idx]

			const result = this.handleNavigationKeys(fg, key)
			if (result === NavigationResult.Next) {
				this.handleNavigation(idx - 1, key)
			}
		}
	}

	private handleNavigationKeys(fg: IFocusGroup, key: number){
		switch (key) {
			case Key.LEFT:
				return fg.onNavigate(Direction.Left)
			case Key.UP:
				return fg.onNavigate(Direction.Up)
			case Key.RIGHT:
				return fg.onNavigate(Direction.Right)
			case Key.DOWN:
				return fg.onNavigate(Direction.Down)
			default:
				return undefined
		}
	}


	public destroy() {
		window.removeEventListener('keydown', this.onKeyDown)
	}
}

///

let manager: GlobalFocusManager

export function getFocusManager(): GlobalFocusManager {
	if (!manager) {
		manager = new GlobalFocusManager()
	}
	return manager
}
