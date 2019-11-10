import React from 'react'
import { FocusDirection } from './focus'
import { FocusElement, FocusGroup, FocusRoot } from './version-2'


export function App() {
	return (
		<FocusRoot>
			{() => (
				<div>
					<h2>V 2.0</h2>
					<FocusGroup dir={FocusDirection.Row}>
						{() => (
							<section>
								<FocusBox>Item 1</FocusBox>
								<FocusBox>Item 2</FocusBox>
							</section>
						)}
					</FocusGroup>
				</div>
			)}
		</FocusRoot>
	)
}

function FocusBox({ children, className }: { className?: string; children: React.ReactNode }) {
	return (
		<FocusElement>
			{({ focused, onMouseEnter }) => (
				<div
					className={`box f-box ${focused ? 'focused' : ''} ${className}`}
					onMouseEnter={onMouseEnter}
				>
					{children}
				</div>
			)}
		</FocusElement>
	)
}
