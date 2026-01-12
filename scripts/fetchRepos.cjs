const { ghIterate, ghRequest } = require( '../lib/gh.cjs' );
const { runner } = require( '../lib/runner.cjs' );
const { writeJSON } = require( '../lib/storage.cjs' );

runner( async () => {
    const repos = [];

    for ( const res of await ghIterate( '/user/repos', { per_page: 100, affiliation: 'owner' } ) ) {
        for ( const repo of res.data ) {
            console.log( `... fetching repo: ${ repo.full_name } ...` );
            const { data } = await ghRequest( '/repos/{owner}/{repo}', { owner: repo.owner.login, repo: repo.name } );
            if ( ! data ) throw new Error( `No data returned for repo: ${ repo.full_name }` );
            repos.push( data );
        }
    }

    await writeJSON( 'repos.json', repos );
} );
