/**
 * External dependencies
 */
import { connect } from 'react-redux';
import page from 'page';
import React, { Component, PropTypes } from 'react';

/**
 * Internal dependencies
 */
import { addStoredCard } from 'state/stored-cards/actions';
import analytics from 'lib/analytics';
import { concatTitle } from 'lib/react-helpers';
import CreditCardForm from 'blocks/credit-card-form';
import DocumentHead from 'components/data/document-head';
import HeaderCake from 'components/header-cake' ;
import Main from 'components/main';
import * as titles from 'me/payment-methods/titles';
import purchasesPaths from 'me/purchases/paths';

class AddCreditCard extends Component {
	static propTypes = {
		addStoredCard: PropTypes.func.isRequired
	};

	goToBillingHistory() {
		page( purchasesPaths.billingHistory() );
	}

	recordFormSubmitEvent() {
		analytics.tracks.recordEvent( 'calypso_add_credit_card_form_submit' );
	}

	render() {
		return (
			<Main>
				<DocumentHead title={ concatTitle( titles.paymentMethods, titles.addCreditCard ) } />

				<HeaderCake onClick={ this.goToBillingHistory }>{ titles.addCreditCard }</HeaderCake>

				<CreditCardForm
					recordFormSubmitEvent={ this.recordFormSubmitEvent }
					saveStoredCard={ this.props.addStoredCard }
					successCallback={ this.goToBillingHistory }
					actionType="card_add" />
			</Main>
		);
	}
}

const mapDispatchToProps = {
	addStoredCard
};

export default connect( null, mapDispatchToProps )( AddCreditCard );
