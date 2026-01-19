const { config } = require( '../lib/config.cjs' );
const { ghGraphql } = require( '../lib/gh.cjs' );
const { runner } = require( '../lib/runner.cjs' );
const { writeJSON } = require( '../lib/storage.cjs' );

runner( async () => {
    const langs = {}, relations = {};
    let hasNextPage = true;
    let endCursor = null;

    while ( hasNextPage ) {
        const query = `
            query ( $first: Int!, $after: String, $login: String! ) {
                user( login: $login ) {
                    repositories( first: $first, after: $after, affiliations: OWNER ) {
                        pageInfo {
                            hasNextPage
                            endCursor
                        }
                        nodes {
                            nameWithOwner
                            isPrivate
                            languages( first: 100 ) {
                                edges {
                                    size
                                    node {
                                        name
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        const { user } = await ghGraphql( query, { first: 100, after: endCursor, login: config.username } );
        const { pageInfo, nodes } = user.repositories;

        for ( const repo of nodes ) {
            if ( ! config.privateRepos && repo.isPrivate ) continue;

            console.log( `... fetching languages for repo: ${ repo.nameWithOwner } ...` );

            if ( ! repo.languages.edges.length ) continue;

            for ( const edge of repo.languages.edges ) {
                const lang = edge.node.name;
                const size = edge.size;

                if ( ! langs[ lang ] ) langs[ lang ] = size;
                else langs[ lang ] += size;

                if ( ! relations[ lang ] ) relations[ lang ] = {};

                for ( const otherEdge of repo.languages.edges ) {
                    const otherLang = otherEdge.node.name;
                    if ( otherLang === lang ) continue;
                    if ( ! relations[ lang ][ otherLang ] ) relations[ lang ][ otherLang ] = 1;
                    else relations[ lang ][ otherLang ] += 1;
                }
            }
        }

        hasNextPage = pageInfo.hasNextPage;
        endCursor = pageInfo.endCursor;
    }

    await writeJSON( 'languages.json', { langs, relations } );
} );
