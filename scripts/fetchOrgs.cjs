const { config } = require( '../lib/config.cjs' );
const { ghGraphql } = require( '../lib/gh.cjs' );
const { runner } = require( '../lib/runner.cjs' );
const { writeJSON } = require( '../lib/storage.cjs' );

runner( async () => {
    const orgs = [];
    let hasNextPage = true;
    let endCursor = null;

    while ( hasNextPage ) {
        const query = `
            query ( $first: Int!, $after: String, $login: String! ) {
                user( login: $login ) {
                    organizations( first: $first, after: $after ) {
                        pageInfo {
                            hasNextPage
                            endCursor
                        }
                        nodes {
                            login
                            name
                            description
                            url
                            avatarUrl
                            websiteUrl
                            location
                            email
                            twitterUsername
                            createdAt
                            repositories {
                                totalCount
                            }
                            membersWithRole {
                                totalCount
                            }
                        }
                    }
                }
            }
        `;

        const { user } = await ghGraphql( query, { first: 100, after: endCursor, login: config.username } );
        const { pageInfo, nodes } = user.organizations;

        for ( const org of nodes ) {
            console.log( `... fetching org: ${ org.login } ...` );

            const data = {
                login: org.login,
                name: org.name,
                description: org.description,
                url: org.url,
                avatar_url: org.avatarUrl,
                blog: org.websiteUrl,
                location: org.location,
                email: org.email,
                twitter_username: org.twitterUsername,
                created_at: org.createdAt,
                public_repos: org.repositories.totalCount,
                public_members: org.membersWithRole.totalCount
            };

            orgs.push( data );
        }

        hasNextPage = pageInfo.hasNextPage;
        endCursor = pageInfo.endCursor;
    }

    await writeJSON( 'orgs.json', orgs );
} );
