const { ghIterate, ghRequest } = require( '../lib/gh.cjs' );
const { runner } = require('../lib/runner.cjs');
const { writeJSON } = require( '../lib/storage.cjs' );

runner( async () => {
    const orgs = [];

    for ( const res of await ghIterate( '/user/orgs', { per_page: 100 } ) ) {
        for ( const org of res.data ) {
            const { data } = await ghRequest( '/orgs/{org}', { org: org.login } );
            if ( ! data ) throw new Error( `No data returned for org: ${ org.login }` );
            orgs.push( data );
        }
    }

    await writeJSON( 'orgs.json', orgs );
} );
