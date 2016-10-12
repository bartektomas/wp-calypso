/**
 * Internal dependencies
 */
import { EDITOR_POST_ID_SET, EDITOR_SHOW_DRAFTS_TOGGLE } from 'state/action-types';
import { ModalViews } from 'state/ui/media-modal/constants';
import { setMediaModalView } from 'state/ui/media-modal/actions';
import { withAnalytics, bumpStat } from 'state/analytics/actions';

/**
 * Returns an action object to be used in signalling that the editor should
 * begin to edit the post with the specified post ID, or `null` as a new post.
 *
 * @param  {?Number} postId Post ID
 * @return {Object}         Action object
 */
export function setEditorPostId( postId ) {
	return {
		type: EDITOR_POST_ID_SET,
		postId
	};
}

/**
 * Returns an action object to be used in signalling that the editor draft
 * drawer visibility state should be toggled.
 *
 * @return {Object} Action object
 */
export function toggleEditorDraftsVisible() {
	return {
		type: EDITOR_SHOW_DRAFTS_TOGGLE
	};
}

/**
 * Returns an action object used in signalling that the media modal current
 * view should be updated in the context of the post editor.
 *
 * @param  {ModalViews} view Media view
 * @return {Object}          Action object
 */
export function setEditorMediaModalView( view ) {
	let stat;
	switch ( view ) {
		case ModalViews.LIST: stat = 'view_list'; break;
		case ModalViews.DETAIL: stat = 'view_detail'; break;
		case ModalViews.GALLERY: stat = 'view_gallery'; break;
		case ModalViews.IMAGE_EDITOR: stat = 'view_edit'; break;
	}

	let action = setMediaModalView( view );
	if ( stat ) {
		action = withAnalytics( bumpStat( 'editor_media_actions', stat ), action );
	}

	return action;
}
