const { config } = require( '../lib/config.cjs' );
const { ghIterate, ghRequest } = require( '../lib/gh.cjs' );
const { runner } = require( '../lib/runner.cjs' );
const { writeJSON } = require( '../lib/storage.cjs' );

runner( async () => {
    const langs = {};

    for ( const res of await ghIterate( '/user/repos', { per_page: 100, affiliation: 'owner' } ) ) {
        for ( const repo of res.data ) {
            if ( ! config.privateRepos && repo.private ) continue;

            console.log( `... fetching languages for repo: ${ repo.full_name } ...` );
            const { data } = await ghRequest( '/repos/{owner}/{repo}/languages', { owner: repo.owner.login, repo: repo.name } );
            if ( ! data || ! Object.keys( data ).length ) continue;

            for ( const [ lang, size ] of Object.entries( data ) ) {
                if ( ! langs[ lang ] ) langs[ lang ] = size;
                else langs[ lang ] += size;
            }
        }
    }

    await writeJSON( 'languages.json', langs );
} );
