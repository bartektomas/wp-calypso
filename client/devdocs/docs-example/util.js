
const getComponentName = docsExample => {
	if ( ! docsExample ) {
		return '';
	}

	if (
		! docsExample.type ||
		( ! docsExample.type.displayName && ! docsExample.type.name )
	) {
		return console.trace( 'Component must be defined' );
	}

	return ( docsExample.type.displayName || docsExample.type.name )
		.replace( /Example$/, '' );
};

const slugToCamelCase = name => {
	if ( ! name ) {
		console.warn( 'name is not defined' );
		return console.trace();
	}

	return name
		.replace( /-([a-z])/g, s => s[ 1 ].toUpperCase() )
		.replace( /^\w/, s => s.toUpperCase() );
};

const camelCaseToSlug = name => {
	if ( ! name ) {
		console.warn( 'name is not defined' );
		return console.trace();
	}

	return name
		.replace( /\.?([A-Z])/g, ( x, y ) => '-' + y.toLowerCase() )
		.replace( /^-/, '' );
};

export {
	getComponentName,
	slugToCamelCase,
	camelCaseToSlug
};
