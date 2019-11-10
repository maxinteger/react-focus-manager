export const FOCUSABLE_ATTR = 'data-focus'

export function findClosestFocusable(el: Element): Element | null {
	if (el.closest && el.parentElement) {
		return el.parentElement.closest(`[${FOCUSABLE_ATTR}]`)
	} else {
		let current = el.parentElement
		while (current && !current.getAttribute(FOCUSABLE_ATTR)) {
			current = current.parentElement
		}
		return current
	}
}

export function discoverFocusableChildren(el: Element): Element[] {
	const result: Element[] = []

	function preOrderWalk(node: Element) {
		if (node.nodeType === 1) {
			for (let i = 0; i < node.children.length; i++) {
				if (node.getAttribute(FOCUSABLE_ATTR)) {
					result.push(node)
				}
				preOrderWalk(node.children[i])
			}
		}
	}
	preOrderWalk(el)
	return result
}

export function waitABit(fn: () => void) {
	window.setTimeout(fn, 1)
}
