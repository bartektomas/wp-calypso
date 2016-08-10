/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import {
	find,
	identity,
	invoker,
	propEq
} from 'ramda';

/**
 * Internal dependencies
 */
import Layout from './layout';

const inBrowser = (() => (
	( 'undefined' !== typeof window ) &&
	( 'undefined' !== typeof document )
))();

const addListener = invoker( 3, 'addEventListener' );
const removeListener = invoker( 3, 'removeEventListener' );
const defaultPreventer = invoker( 0, 'preventDefault' );

const toggleCapturedScroll = doCapture => () => {
	return;
	if ( ! inBrowser ) {
		return;
	}

	const toggle = doCapture
		? addListener
		: removeListener;

	[ 'mousewheel', 'touchmove' ]
		.forEach( event => toggle( event, defaultPreventer, false, document.body ) );
};

export class NotificationsPanel extends Component {
	constructor( props ) {
		super( props );

		this.toggleListeners = this.toggleListeners.bind( this );
	}

	componentDidMount() {
		this.toggleListeners( true );
	}

	componentWillUnmount() {
		this.toggleListeners( false );
		toggleCapturedScroll( false );
	}

	toggleListeners( doToggleOn ) {
		return;
		const {
			clickInterceptor
		} = this.props;

		if ( ! inBrowser ) {
			return;
		}

		const toggle = doToggleOn
			? addListener
			: removeListener;

		[
			[ 'mousedown', clickInterceptor, true ],
			[ 'touchstart', clickInterceptor, true ],
			document.documentElement.classList.contains( 'touch' ) &&
				[ 'touchmove', defaultPreventer, false ]
		]
			.filter( identity )
			.forEach( ( [ event, action, useCapture ] ) => toggle( event, action, useCapture, window ) );
	}

	render() {
		const {
			notes,
			selectNote,
			selectedNote
		} = this.props;

		const note = find( propEq( 'id', selectedNote ), notes );

		return (
			<div
				id="wpnt-notes-panel2"
				onMouseEnter={ toggleCapturedScroll( true ) }
				onMouseLeave={ toggleCapturedScroll( false ) }
			>
				<Layout { ...{
					notes,
					note,
					selectNote,
					selectedNote
				} } />
			</div>
		);
	}
}

NotificationsPanel.displayName = 'NotificationsPanel';

NotificationsPanel.propTypes = {
	clickInterceptor: PropTypes.func,
	notes: PropTypes.array,
	selectedNote: PropTypes.number,
	selectNote: PropTypes.func
};

export default NotificationsPanel;
