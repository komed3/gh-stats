const { config } = require( '../lib/config.cjs' );
const { ghIterate, ghRequest } = require( '../lib/gh.cjs' );
const { runner } = require( '../lib/runner.cjs' );
const { writeJSON } = require( '../lib/storage.cjs' );

runner( async () => {
    const publicRepos = [], privateRepos = [];

    for ( const res of await ghIterate( '/user/repos', { per_page: 100, affiliation: 'owner' } ) ) {
        for ( const repo of res.data ) {
            console.log( `... fetching repo: ${ repo.full_name } ...` );
            const { data } = await ghRequest( '/repos/{owner}/{repo}', { owner: repo.owner.login, repo: repo.name } );
            if ( ! data ) throw new Error( `No data returned for repo: ${ repo.full_name }` );

            if ( ! data.private ) publicRepos.push( data );
            else if ( config.privateRepos ) privateRepos.push( data );
        }
    }

    publicRepos.length && await writeJSON( 'repos.json', publicRepos );
    privateRepos.length && await writeJSON( 'privateRepos.json', privateRepos );
} );
