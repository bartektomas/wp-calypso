/**
 * External dependencies
 */
import React from 'react';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';
import page from 'page';

/**
 * Internal dependencies
 */
import Gridicon from 'components/gridicon';
import Button from 'components/button';
import { openChat } from 'state/ui/happychat/actions';
import viewport from 'lib/viewport';
import config from 'config';

const SidebarFooter = ( { translate, children, onOpenChat } ) => (
	<div className="sidebar__footer">
		{ children }
		<Button borderless href={ config( 'signup_url' ) + '?ref=calypso-selector' }>
			<Gridicon icon="add-outline" /> { translate( 'Add New Site' ) }
		</Button>
		<Button className="sidebar__footer-help" borderless href="/help" title={ translate( 'Help' ) }>
			<Gridicon icon="help-outline" />
		</Button>
		{ config.isEnabled( 'happychat' )
			? (
			<Button className="sidebar__footer-chat" borderless onClick={ onOpenChat } title={ translate( 'Support Chat' ) }>
				<Gridicon icon="chat" />
			</Button>
			) : null
		}
	</div>
);

const mapStateToProps = () => {
	return {};
};

const mapDispatchToProps = ( dispatch ) => {
	return {
		onOpenChat() {
			if ( viewport.isMobile() ) {
				// For mobile clients, happychat will always use the page compoent instead of the sidebar
				page( '/me/chat' );
				return;
			}
			dispatch( openChat() );
		}
	};
};

export default connect( mapStateToProps, mapDispatchToProps )( localize( SidebarFooter ) );
