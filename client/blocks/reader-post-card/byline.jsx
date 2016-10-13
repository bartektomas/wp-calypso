/**
 * External Dependencies
 */
import React from 'react';
import { get } from 'lodash';

/**
 * Internal Dependencies
 */
import ExternalLink from 'components/external-link';
import Gravatar from 'components/gravatar';
import Gridicon from 'components/gridicon';
import PostTime from 'reader/post-time';
import { siteNameFromSiteAndPost } from 'reader/utils';
import {
	recordAction,
	recordGaEvent,
	recordTrackForPost,
	recordPermalinkClick
} from 'reader/stats';
import ReaderSiteStreamLink from 'blocks/reader-site-stream-link';

class PostByline extends React.Component {

	static propTypes = {
		post: React.PropTypes.object.isRequired,
		site: React.PropTypes.object,
		feed: React.PropTypes.object,
		isDiscoverPost: React.PropTypes.bool
	}

	static defaultProps = {
		isDiscoverPost: false
	}

	recordTagClick = () => {
		recordAction( 'click_tag' );
		recordGaEvent( 'Clicked Tag Link' );
		recordTrackForPost( 'calypso_reader_tag_clicked', this.props.post, {
			tag: this.props.post.primary_tag.slug
		} );
	}

	recordDateClick() {
		recordPermalinkClick( 'timestamp' );
		recordGaEvent( 'Clicked Post Permalink', 'timestamp' );
	}

	recordAuthorClick = () => {
		recordAction( 'click_author' );
		recordGaEvent( 'Clicked Author Link' );
		recordTrackForPost( 'calypso_reader_author_link_clicked', this.props.post );
	}

	renderAuthorName() {
		const post = this.props.post,
			authorName = ( <span className="reader-post-card__author-name">{ post.author.name }</span> );

		if ( ! post.author.URL ) {
			return (
				<span>{ authorName }</span>
			);
		}

		/* eslint-disable react/jsx-no-target-blank */
		return (
			<ExternalLink href={ post.author.URL } target="_blank" onClick={ this.recordAuthorClick }>
				{ authorName }
			</ExternalLink>
		);
		/* eslint-enable react/jsx-no-target-blank */
	}

	render() {
		const { post, site, feed, isDiscoverPost } = this.props;
		const primaryTag = post && post.primary_tag;
		let siteName = siteNameFromSiteAndPost( site, post );

		if ( ! siteName ) {
			siteName = this.translate( '(no title)' );
		}

		/* eslint-disable wpcalypso/jsx-gridicon-size */
		return (
			<div className="reader-post-card__meta ignore-click">
				<Gravatar user={ post.author } />
				<div className="reader-post-card__meta-details">
					{ ! isDiscoverPost && get( post, 'author.name' ) &&
						<a className="reader-post-card__author reader-post-card__link">
							{ this.renderAuthorName() }
						</a>
					}
					<ReaderSiteStreamLink
						className="reader-post-card__site reader-post-card__link"
						feedId={ get( feed, 'ID' ) }
						siteId={ get( site, 'ID' ) }
						post={ post }>
						{ siteName }
					</ReaderSiteStreamLink>
					<div className="reader-post-card__timestamp-and-tag">
						{ post.date && post.URL &&
							<span className="reader-post-card__timestamp">
								<a className="reader-post-card__timestamp-link"
									onClick={ this.recordDateClick }
									href={ post.URL }
									target="_blank"
									rel="noopener noreferrer">
									<PostTime date={ post.date } />
								</a>
							</span>
						}
						{ primaryTag &&
							<span className="reader-post-card__tag">
								<Gridicon icon="tag" />
								<a href={ '/tag/' + primaryTag.slug } className="reader-post-card__tag-name ignore-click" onClick={ this.recordTagClick }>
									{ primaryTag.name }
								</a>
							</span>
						}
					</div>
				</div>
			</div>
		);
		/* eslint-enable wpcalypso/jsx-gridicon-size */
	}

}

export default PostByline;
