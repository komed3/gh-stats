const { ghIterate, ghRequest } = require( '../lib/gh.cjs' );
const { writeJSON } = require( '../lib/storage.cjs' );

async function fetchOrgs () {
    const orgs = [];

    for ( const res of await ghIterate( '/user/orgs', { per_page: 100 } ) ) {
        for ( const org of res.data ) orgs.push(
            ( await ghRequest( '/orgs/{org}', { org: org.login } ) ).data
        );
    }

    await writeJSON( 'orgs.json', orgs );
}

if ( require.main === module ) fetchOrgs();

module.exports = fetchOrgs;
