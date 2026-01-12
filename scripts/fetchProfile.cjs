const { ghRequest } = require( '../lib/gh.cjs' );
const { runner } = require( '../lib/runner.cjs' );
const { writeJSON } = require( '../lib/storage.cjs' );

runner( async () => {
    const { data } = await ghRequest( `/user` );
    if ( ! data ) throw new Error( 'No profile data returned from GitHub API' );
    await writeJSON( 'profile.json', data );
} );
