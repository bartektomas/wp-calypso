/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import { connect } from 'react-redux';
import { noop, throttle } from 'lodash';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import ImageEditorCrop from './image-editor-crop';
import MediaUtils from 'lib/media/utils';
import {
	getImageEditorTransform,
	getImageEditorFileInfo,
	getImageEditorCrop
} from 'state/ui/editor/image-editor/selectors';
import { setImageEditorCropBounds } from 'state/ui/editor/image-editor/actions';

class ImageEditorCanvas extends Component {
	static propTypes = {
		src: PropTypes.string,
		mimeType: PropTypes.string,
		transform: PropTypes.shape( {
			degrees: PropTypes.number,
			scaleX: PropTypes.number,
			scaleY: PropTypes.number
		} ),
		crop: PropTypes.shape( {
			topRatio: PropTypes.number,
			leftRatio: PropTypes.number,
			widthRatio: PropTypes.number,
			heightRatio: PropTypes.number
		} ),
		setImageEditorCropBounds: PropTypes.func,
		onLoadError: PropTypes.func
	};

	static defaultProps = {
		transform: {
			degrees: 0,
			scaleX: 1,
			scaleY: 1
		},
		crop: {
			cropTopRatio: 0,
			cropLeftRatio: 0,
			cropWidthRatio: 1,
			cropHeightRatio: 1
		},
		setImageEditorCropBounds: noop,
		onLoadError: noop
	};

	constructor( props ) {
		super( props );

		this.state = {
			imageLoaded: false
		};

		this.onWindowResize = null;

		this.onLoadComplete = this.onLoadComplete.bind( this );
	}

	componentWillReceiveProps( newProps ) {
		if ( this.props.src !== newProps.src ) {
			this.getImage( newProps.src );
		}
	}

	getImage( url ) {
		const { onLoadError, mimeType } = this.props;

		const req = new XMLHttpRequest();
		req.open( 'GET', url + '?', true ); // Fix #7991 by forcing Safari to ignore cache and perform valid CORS request
		req.responseType = 'arraybuffer';
		req.onload = () => {
			const objectURL = window.URL.createObjectURL( new Blob( [ req.response ], { type: mimeType } ) );
			this.initImage( objectURL );
		};

		req.onerror = error => onLoadError( error );
		req.send();
	}

	initImage( src ) {
		this.image = new Image();
		this.image.src = src;
		this.image.onload = this.onLoadComplete;
		this.image.onerror = this.onLoadComplete;
	}

	onLoadComplete( event ) {
		if ( event.type !== 'load' ) {
			return;
		}

		this.drawImage();
		this.updateCanvasPosition();
		this.onWindowResize = throttle( this.updateCanvasPosition, 200 );
		if ( typeof window !== 'undefined' ) {
			window.addEventListener( 'resize', this.onWindowResize );
		}

		this.setState( {
			imageLoaded: true
		} );
	}

	componentWillUnmount() {
		if ( typeof window !== 'undefined' && this.onWindowResize ) {
			window.removeEventListener( 'resize', this.onWindowResize );
			this.onWindowResize = null;
		}
	}

	componentDidUpdate() {
		this.drawImage();
		this.updateCanvasPosition();
	}

	toBlob( callback ) {
		const {
			leftRatio,
			topRatio,
			widthRatio,
			heightRatio
		} = this.props.crop;

		const {
			mimeType,
			transform
		} = this.props;

		const canvas = ReactDom.findDOMNode( this.refs.canvas ),
			context = canvas.getContext( '2d' ),
			rotated = transform.degrees % 180 !== 0,
			imageWidth = rotated ? this.image.height : this.image.width,
			imageHeight = rotated ? this.image.width : this.image.height,
			croppedLeft = leftRatio * imageWidth,
			croppedTop = topRatio * imageHeight,
			croppedWidth = widthRatio * imageWidth,
			croppedHeight = heightRatio * imageHeight;

		const imageData = context.getImageData(
			croppedLeft,
			croppedTop,
			croppedWidth,
			croppedHeight
		);

		const newCanvas = document.createElement( 'canvas' );

		newCanvas.width = croppedWidth;
		newCanvas.height = croppedHeight;

		const newContext = newCanvas.getContext( '2d' );
		newContext.putImageData( imageData, 0, 0 );

		MediaUtils.canvasToBlob( newCanvas, callback, mimeType, 1 );
	}

	drawImage() {
		if ( ! this.image ) {
			return;
		}

		const canvas = ReactDom.findDOMNode( this.refs.canvas ),
			imageWidth = this.image.width,
			imageHeight = this.image.height,
			transform = this.props.transform,
			rotated = transform.degrees % 180 !== 0;

		//make sure the canvas draw area is the same size as the image
		canvas.width = rotated ? imageHeight : imageWidth;
		canvas.height = rotated ? imageWidth : imageHeight;

		const context = canvas.getContext( '2d' );

		context.clearRect( 0, 0, canvas.width, canvas.height );
		context.save();

		// setTransform() could be replaced with translate(), but it leads to
		// a false positive warning from eslint rule wpcalypso/i18n-no-variables
		context.setTransform( 1, 0, 0, 1, canvas.width / 2, canvas.height / 2 );

		context.scale( transform.scaleX, transform.scaleY );
		context.rotate( transform.degrees * Math.PI / 180 );

		context.drawImage( this.image, -imageWidth / 2, -imageHeight / 2 );

		context.restore();
	}

	updateCanvasPosition() {
		const {
			leftRatio,
			topRatio,
			widthRatio,
			heightRatio
		} = this.props.crop;

		const canvas = ReactDom.findDOMNode( this.refs.canvas ),
			canvasX = -50 * widthRatio - 100 * leftRatio,
			canvasY = -50 * heightRatio - 100 * topRatio;

		this.props.setImageEditorCropBounds(
			canvas.offsetTop - canvas.offsetHeight * -canvasY / 100,
			canvas.offsetLeft - canvas.offsetWidth * -canvasX / 100,
			canvas.offsetTop + canvas.offsetHeight * ( 1 + canvasY / 100 ),
			canvas.offsetLeft + canvas.offsetWidth * ( 1 + canvasX / 100 )
		);
	}

	preventDrag( event ) {
		event.preventDefault();

		return false;
	}

	render() {
		const {
			leftRatio,
			topRatio,
			widthRatio,
			heightRatio
		} = this.props.crop;

		const canvasX = -50 * widthRatio - 100 * leftRatio;
		const canvasY = -50 * heightRatio - 100 * topRatio;

		const canvasStyle = {
			transform: 'translate(' + canvasX + '%, ' + canvasY + '%)',
			maxWidth: ( 85 / widthRatio ) + '%',
			maxHeight: ( 85 / heightRatio ) + '%'
		};

		const { imageLoaded } = this.state;

		const canvasClasses = classNames( 'image-editor__canvas', {
			'is-placeholder': ! imageLoaded
		} );

		return (
			<div className="image-editor__canvas-container">
				{ imageLoaded && <ImageEditorCrop /> }
				<canvas
					ref="canvas"
					style={ canvasStyle }
					onMouseDown={ this.preventDrag }
					className={ canvasClasses } />
			</div>
		);
	}
}

export default connect(
	( state ) => {
		const transform = getImageEditorTransform( state );
		const { src, mimeType } = getImageEditorFileInfo( state );
		const crop = getImageEditorCrop( state );

		return {
			src,
			mimeType,
			transform,
			crop
		};
	},
	{
		setImageEditorCropBounds
	},
	null,
	{ withRef: true }
)( ImageEditorCanvas );
