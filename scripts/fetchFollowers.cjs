const { ghRequest } = require( '../lib/gh.cjs' );
const { runner } = require( '../lib/runner.cjs' );
const { writeJSON } = require( '../lib/storage.cjs' );

runner( async () => {
    const { data } = await ghRequest( `/user/followers` );
    if ( ! data ) throw new Error( 'No follower data returned from GitHub API' );
    await writeJSON( 'follower.json', data );
} );
