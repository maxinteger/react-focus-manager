import Reconciler from 'react-reconciler'
import { ReactNode } from 'react'
import { FocusManager } from './FocusGroup'

const rootHostContext = {};
const childHostContext = {};
let focusManager: FocusManager

const hostConfig: Reconciler.HostConfig<any, any, any, any, any, any, any, any, any, any, any, any> = {
	isPrimaryRenderer: false,
	noTimeout: undefined,
	supportsHydration: false,
	supportsPersistence: false,
	supportsMutation: true, // it works by mutating nodes
	now: Date.now,

	getRootHostContext: () => {
		return rootHostContext;
	},
	prepareForCommit: () => {},
	resetAfterCommit: () => {},
	getChildHostContext: () => {
		return childHostContext;
	},
	shouldSetTextContent: (type, props) => {
		return typeof props.children === 'string' || typeof props.children === 'number';
	},
	/**
   This is where react-reconciler wants to create an instance of UI element in terms of the target.
	 Since our target here is the DOM, we will create document.createElement and
	 type is the argument that contains the type string like div or img or h1 etc.
	 The initial values of domElement attributes can be set in this function from the newProps argument
	 */
	createInstance: (type, newProps, rootContainerInstance, _currentHostContext, workInProgress) => {
		if (newProps.dataFocusGroupKey || newProps.dataFocusElementKey) {
			// console.log('>>>', type, newProps, rootContainerInstance, _currentHostContext, workInProgress)
			console.log('>>>', type, newProps.dataFocusGroupKey || newProps.dataFocusElementKey, newProps, workInProgress)
		}
		const domElement = document.createElement(type);
		Object.keys(newProps).forEach(propName => {
			const propValue = newProps[propName];
			if (propName === 'children') {
				if (typeof propValue === 'string' || typeof propValue === 'number') {
					domElement.textContent = propValue;
				}
			} else if (propName === 'onClick') {
				domElement.addEventListener('click', propValue);
			} else if (propName === 'className') {
				domElement.setAttribute('class', propValue);
			} else {
				const propValue = newProps[propName];
				domElement.setAttribute(propName, propValue);
			}
		});
		return domElement;
	},
	createTextInstance: text => {
		return document.createTextNode(text);
	},
	appendInitialChild: (parent, child) => {
		parent.appendChild(child);
	},
	appendChild(parent, child) {
		parent.appendChild(child);
	},
	appendChildToContainer: (parent, child) => {
		parent.appendChild(child);
	},

	prepareUpdate(domElement, oldProps, newProps) {
		return true;
	},

	commitUpdate(domElement, updatePayload, type, oldProps, newProps) {
		Object.keys(newProps).forEach(propName => {
			const propValue = newProps[propName];
			if (propName === 'children') {
				if (typeof propValue === 'string' || typeof propValue === 'number') {
					domElement.textContent = propValue;
				}
			} else {
				const propValue = newProps[propName];
				domElement.setAttribute(propName, propValue);
			}
		});
	},
	commitTextUpdate(textInstance, oldText, newText) {
		textInstance.text = newText;
	},
	removeChild(parentInstance, child) {
		parentInstance.removeChild(child);
	},
	cancelDeferredCallback(callbackID: any): void {
	},
	clearTimeout(handle: any): void {
	},
	finalizeInitialChildren(parentInstance: any, type: any, props: any, rootContainerInstance: any, hostContext: any): boolean {
		return false;
	},
	getPublicInstance(instance: any): any {
		return undefined;
	},
	scheduleDeferredCallback(callback: () => any, options?: { timeout: number }): any {
	},
	setTimeout(handler: (...args: any[]) => void, timeout: number): any {
		return undefined;
	},
	shouldDeprioritizeSubtree(type: any, props: any): boolean {
		return false;
	},
};

const MTVRenderer = Reconciler(hostConfig);

const RendererPublicAPI = {
	render(element: ReactNode, container: any) {
		focusManager = new FocusManager()
		MTVRenderer.createContainer(container, false, false)

		// Create a root Container if it doesnt exist
		if (!container._rootContainer) {
			container._rootContainer = MTVRenderer.createContainer(container, false, false);
		}

		// update the root Container
		// TODO: fix callback
		return MTVRenderer.updateContainer(element, container._rootContainer, null, () => void 0);
	}
};

export default RendererPublicAPI
