declare interface Focusable {
	focusKey: string
	focused?: boolean
	onAction?: () => void
	onHover?: () => void
	skip?: FocusSkip
}

