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
		<Button className="sidebar__footer__help" borderless href="/help" title={ translate( 'Help' ) }>
			<Gridicon icon="help-outline" />
		</Button>
		{ config.isEnabled( 'happychat' )
			? (
			<Button className="sidebar__footer__support-chat" borderless onClick={ onOpenChat } title={ translate( 'Support Chat' ) }>
				<svg className="gridicon" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><path d="M20 4h-8c-1.1 0-2 .9-2 2v2h2c1.7 0 3 1.3 3 3v2h2v3.5l3.3-2.3c1.1-.8 1.7-2 1.7-3.3V6c0-1.1-.9-2-2-2z"/><path d="M14 11v5c0 1.1-.9 2-2 2H7v3.5l-3.3-2.3c-1.1-.8-1.7-2-1.7-3.3V11c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2z"/></g></svg>
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
